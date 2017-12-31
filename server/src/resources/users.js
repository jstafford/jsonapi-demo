'use strict'

const jsonapiServer = require('jsonapi-server')
const usersHandler = require('../handlers/usersHandler.js')

jsonapiServer.define({
  namespace: 'json:api',
  resource: 'users',
  description: 'Public profile for a user.',
  handlers: usersHandler,
  searchParams: { },
  attributes: {
    // name: jsonapiServer.Joi.string().regex(/^[A-Za-z]+[-0-9A-Z_a-z]+[0-9A-Za-z]+$/)
    name: jsonapiServer.Joi.string()
      .description('The user’s public username')
      .example('yertle-the-turtle'),
    tableinfos: jsonapiServer.Joi.many('tableinfos')
      .description('All of the tables owned by this user'),
    follows: jsonapiServer.Joi.many('users')
      .description('Relationship to users followed by this user.'),
    stars: jsonapiServer.Joi.many('tableinfos')
      .description('Relationship to tables starred by this user.'),
    // server side managed data (read only to clients)
    createdDate: jsonapiServer.Joi.date().iso().allow(null).meta('readonly').description('Read only date user joined.'),
    tablesCount: jsonapiServer.Joi.number().integer().allow(null).meta('readonly').description('Read only count of tables owned by user.'),
    updatedDate: jsonapiServer.Joi.date().iso().allow(null).meta('readonly').description('Read only date of last user activity.'),
    followersCount: jsonapiServer.Joi.number().integer().allow(null).meta('readonly').description('Read only count of followers.'),
  },
  examples: [
    {
      id: '42D2F0C8-407D-48DB-A944-D6D68D28DE2A',
      type: 'users',
      name: 'demo-user',
      tableinfos: [
        { type: 'tableinfos', id: 'A2930D1F-BB4B-4AA3-8A77-6752A17D3A38' },
        { type: 'tableinfos', id: 'F6E7A2B8-F522-411F-BA1E-C28AB85A4E7C' }
      ]
    }
  ]
})
