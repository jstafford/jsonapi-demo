'use strict'

const jsonapiServer = require('jsonapi-server')
const tagsHandler = require('../handlers/tagsHandler.js')

jsonapiServer.define({
  namespace: 'json:api',
  resource: 'tags',
  description: 'Resource used for tagging tables.',
  handlers: tagsHandler,
  searchParams: { },
  attributes: {
    // server side managed data (read only to clients)
    count: jsonapiServer.Joi.number().integer().allow(null).meta('readonly').description('Read only count of tables using this tag.'),
  },
  examples: [
    {
      id: 'internet',
      type: 'tags',
      count: 201,
    }
  ]
})
