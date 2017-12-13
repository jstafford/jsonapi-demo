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
    username: jsonapiServer.Joi.string().regex(/^[A-Za-z]+[-0-9A-Z_a-z]+[0-9A-Za-z]+$/)
      .description('The user’s public username')
      .example('yertle-the-turtle'),
    tables: jsonapiServer.Joi.many('tables')
      .description('All of the tables owned by this user')
  },
  examples: [
    {
      id: '42D2F0C8-407D-48DB-A944-D6D68D28DE2A',
      type: 'users',
      username: 'demo-user',
      tables: [
        { type: 'tables', id: 'A2930D1F-BB4B-4AA3-8A77-6752A17D3A38' },
        { type: 'tables', id: 'F6E7A2B8-F522-411F-BA1E-C28AB85A4E7C' }
      ]
    }
  ]
})
