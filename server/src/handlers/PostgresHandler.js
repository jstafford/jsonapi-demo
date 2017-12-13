'use strict'
const debug = require('debug')
const _ = require('lodash')
const pg = require('pg')

const logger = debug("jsonApi:store:postgres")

// A singleton connection pool to be reused throughout the application
let connectionPoolPromise = false
let connectionPool = null

// a singleton set of known types for validating requests against
const knownTypes = {}

const PostgresHandler = module.exports = function PostgresHandler (config) {
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


/**
  initialise gets invoked once for each resource that uses this hander.
  In this instance, we're allocating an array in our in-memory data store.
 */
PostgresHandler.prototype.initialise = async function (resourceConfig) {
  if (!connectionPool) {
    if (!connectionPoolInitializing) {
      connectionPoolPromise = new Promise()
      const pool = new pg.Pool(options)
      // must register an error handler to avoid an uncaught error that could shut down the server
      pool.on('error', poolErrorLogger)
      const client = await pool.connect()
      client.release()
      // Save connection pool for reuse everywhere and log
      connectionPool = pool
      connectionPoolPromise.resolve()
    } else {
      await connectionPoolPromise
    }
  }
  knownTypes[resourceConfig.resource] = true
  this.ready = true
}

/**
  Search for a list of resources, given a resource type.
 */
PostgresHandler.prototype.search = async function (request, callback) {
  logger('err', JSON.stringify(request))
  return callback(null, [], 0)
}

/**
  Find a specific resource, given a resource type and and id.
 */
PostgresHandler.prototype.find = async function (request, callback) {
  if (knownTypes.hasOwnProperty(request.params.type)) {
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
  } else {
    return callback({
      status: '400',
      code: 'EBADREQUEST',
      title: 'Requested resource type does not exist',
      detail: `There is no resource type "${request.params.type}"`
    })
  }
}

/**
  Create (store) a new resource given a resource type and an object.
 */
PostgresHandler.prototype.create = async function (request, newResource, callback) {
  if (knownTypes.hasOwnProperty(request.params.type)) {
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
  } else {
    return callback({
      status: '400',
      code: 'EBADREQUEST',
      title: 'Requested resource type does not exist',
      detail: `There is no resource type "${request.params.type}"`
    })
  }
}

/**
  Delete a resource, given a resource type and and id.
 */
PostgresHandler.prototype.delete = async function (request, callback) {
  if (knownTypes.hasOwnProperty(request.params.type)) {
    const query = `DELETE FROM ${request.params.type} WHERE id = $1;`
    const pool = getPool()
    await pool.query(query, [request.params.id])
    return callback()
  } else {
    return callback({
      status: '400',
      code: 'EBADREQUEST',
      title: 'Requested resource type does not exist',
      detail: `There is no resource type "${request.params.type}"`
    })
  }
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
PostgresHandler.prototype.update = function (request, partialResource, callback) {
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
