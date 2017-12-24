'use strict'
const debug = require('debug')
const _ = require('lodash')
const pg = require('pg')
const validator = require('validator')

const logger = debug("jsonApi:store:postgres")

// A singleton connection pool to be reused throughout the application
let connectionPoolPromise = false
let connectionPool = null

// a singleton set of known types for validating requests against
const knownTypes = {}

const PostgresHandler = module.exports = function PostgresHandler(config) {
  this.config = config
}

/**
  Handlers readiness status. This should be set to `true` once all handlers are ready to process requests.
 */
PostgresHandler.prototype.ready = false

const poolErrorLogger = (err, client) => {
  if (client) {
    logger('err', `Postgres client error caught in pool with processID: ${client.processID} activeQuery: ${client.activeQuery}`)
  }
  logger('err', JSON.stringify(err))
}

const getPool = () => {
  if (connectionPool === null) {
    throw new Error('No connection pool. Handler called before ready.')
  }

  return connectionPool
}

const validateRequest = (request) => {
  let errDetail = null
  if (request.params) {
    const params = request.params
    if (!knownTypes.hasOwnProperty(params.type)) {
      errDetail: `There is no resource type "${params.type}"`
    }
    if (!errDetail && params.id && !validator.isUUID(params.id)) {
      errDetail: 'The parameter id must be a UUID.'
    }
    if (params.page) {
      const page = params.page
      if (!errDetail && page.limit && !_.isInteger(page.limit)) {
        errDetail: 'The parameter page.limit must be an integer.'
      }
      if (!errDetail && page.limit && (page.limit < 1 || page.limit > 1000)) {
        errDetail: 'The parameter page.limit must be in the range 1 to 1,000.'
      }
      if (!errDetail && page.offset && !_.isInteger(page.offset)) {
        errDetail: 'The parameter page.offset must be an integer.'
      }
      if (!errDetail && page.offset && (page.offset < 0 || page.offset > Number.MAX_SAFE_INTEGER)) {
        errDetail: 'The parameter page.limit must be in the range 1 to Number.MAX_SAFE_INTEGER.'
      }
    }
  } else {
    errDetail: 'No paramters supplied.'
  }
  if (errDetail) {
    return {
      status: '400',
      code: 'EBADREQUEST',
      title: 'Invalid request',
      detail: errDetail
    }
  } else {
    return null
  }
}

const initPool = async (config) => {
  const pool = new pg.Pool(config)
  // must register an error handler to avoid an uncaught error that could shut down the server
  pool.on('error', poolErrorLogger)
  const client = await pool.connect()
  client.release()
  // Save connection pool for reuse everywhere and log
  connectionPool = pool
}

/**
  initialise gets invoked once for each resource that uses this hander.
  In this instance, we're allocating an array in our in-memory data store.
 */
PostgresHandler.prototype.initialise = async function(resourceConfig) {
  if (!connectionPool) {
    if (!connectionPoolPromise) {
      connectionPoolPromise = initPool(this.config)
    }
    await connectionPoolPromise
  }
  knownTypes[resourceConfig.resource] = true
  this.ready = true
}

/**
  Search for a list of resources, given a resource type.
 */
PostgresHandler.prototype.search = async function(request, callback) {
  const err = validateRequest(request)
  if (err) {
    return callback(err)
  }
  let query = `SELECT data, count(*) OVER() AS full_count FROM ${request.params.type}`
  let values = []
  if (request.params.filter) {
    query += ' WHERE'
    const filters = Object.keys(request.params.filter)
    filters.forEach(key => {
      let and = ''
      const filterParam = request.params.filter[key]

      query += `${and}`
      and = ' AND'
      // Id filtering handled special, since id is primary key
      if (key === 'id') {
        query += ` id`
        if (Array.isArray(filterParam)) {
          let comma = ''
          query += ' IN ('
          filterParam.forEach(id => {
            values.push(id)
            query += `${comma}\$${values.length}`
            comma = ', '
          })
          query += ')'
        } else {
          values.push(filterParam)
          query += ` = \$${values.length}`
        }
      } else {
        query += ` data @>`
        if (typeof(filterParam) === 'object') {
          values.push(`{"${key}":${JSON.stringify(filterParam)}}`)
          query += ` \$${values.length}`
        } else {
          values.push(`{"${key}":"${filterParam}"}`)
          query += ` \$${values.length}`
        }
      }

    })
  }

  if (request.params.sort) {
    const dir = request.params.sort.charAt(0) === '-' ? 'DESC' : 'ASC'
    const sortField = request.params.sort.replace('-', '')
    values.push(sortField)
    query += ` ORDER BY data->\$${values.length} ${dir}`
  }
  if (request.params.page) {
    const page = request.params.page
    if (page.limit) {
      values.push(page.limit)
      query += ` LIMIT \$${values.length}`
    }
    if (page.offset) {
      values.push(page.offset)
      query += ` OFFSET \$${values.length}`
    }
  }
  query += ';'
  const pool = getPool()
  const response = await pool.query(query, values)
  if (response && response.rows) {
    const resources = response.rows.map(row => (row.data))
    const total = (response.rows.length > 0) ? response.rows[0].full_count : 0
    // Return the requested resources
    return callback(null, resources, total)
  }
  return callback(null, [], 0)
}

/**
  Find a specific resource, given a resource type and and id.
 */
PostgresHandler.prototype.find = async function(request, callback) {
  const err = validateRequest(request)
  if (err) {
    return callback(err)
  }
  const query = `SELECT data FROM ${request.params.type} WHERE id=$1;`
  const pool = getPool()
  const response = await pool.query(query, [request.params.id])
  if (response && response.rows && response.rows.length) {
    const row = response.rows[0]
    if (row && row.hasOwnProperty('data') && row.data) {
      // Return the requested resource
      return callback(null, row.data)
    }
  }
  return callback({
    status: '404',
    code: 'ENOTFOUND',
    title: 'Requested resource does not exist',
    detail: `There is no ${request.params.type} with id ${request.params.id}`
  })
}

/**
  Create (store) a new resource given a resource type and an object.
 */
PostgresHandler.prototype.create = async function(request, newResource, callback) {
  const err = validateRequest(request)
  if (err) {
    return callback(err)
  }
  const query = `INSERT INTO ${request.params.type} (id, data) VALUES($1, $2) RETURNING data;`
  const pool = getPool()
  const response = await pool.query(query, [newResource.id, JSON.stringify(newResource)])
  if (response && response.rows && response.rows.length) {
    const row = response.rows[0]
    if (row && row.hasOwnProperty('data') && row.data) {
      // Return the requested resource
      return callback(null, row.data)
    }
  }
  return callback({
    status: '409',
    code: 'ECONFLICT',
    title: 'Requested resource already exists',
    detail: `There is already a resource of type ${request.params.type} with id ${request.params.id}`
  })
}

/**
  Delete a resource, given a resource type and and id.
 */
PostgresHandler.prototype.delete = async function(request, callback) {
  const err = validateRequest(request)
  if (err) {
    return callback(err)
  }
  const query = `DELETE FROM ${request.params.type} WHERE id = $1;`
  const pool = getPool()
  await pool.query(query, [request.params.id])
  return callback()
}

/**
  from http://jsonapi.org/format/#crud-updating:
  "The server MUST NOT interpret missing attributes as null values."
  The spec does not specifically address Arrays, but since
  JSON supports neither undefined, nor sparse arrays,
  the implication is that null elements in an array MUST NOT
  be interpreted as deleting those elements.
 */
const jsonApiPatchCustomizer = (objValue, srcValue, key, object, source, stack) => {
  if (null === srcValue && _.isArray(object)) {
    return objValue
  }
}

/**
  Update a resource, given a resource type and id, along with a partialResource.
  partialResource contains a subset of changes that need to be merged over the original.
 */
PostgresHandler.prototype.update = function(request, partialResource, callback) {
  // Find the requested resource
  this.find(request, async (err, theResource) => {
    if (err) {
      return callback(err)
    }

    // Merge the partialResource over the original
    theResource = _.mergeWith(theResource, partialResource, jsonApiPatchCustomizer)

    const query = `UPDATE ${request.params.type} SET data = $1 WHERE id = $2 RETURNING data;`
    const pool = getPool()
    const response = await pool.query(query, [JSON.stringify(theResource), request.params.id])
    if (response && response.rows && response.rows.length) {
      const row = response.rows[0]
      if (row && row.hasOwnProperty('data') && row.data) {
        // Return the requested resource
        return callback(null, row.data)
      }
    }
    return callback({
      status: '500',
      code: 'EUNKNOWN',
      title: 'An unknown error has occured',
      detail: 'No resource returned from the database'
    })
  })
}
