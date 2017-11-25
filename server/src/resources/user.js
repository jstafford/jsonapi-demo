'use strict'

const jsonapiServer = require('jsonapi-server')
const usersHandler = require('../handlers/usersHandler.js')

jsonapiServer.define({
  namespace: 'json:api',
  resource: 'user',
  description: 'Public information about each user.',
  handlers: usersHandler,
  searchParams: { },
  attributes: {
    username: jsonapiServer.Joi.string().regex(/^[A-Za-z]+[-0-9A-Z_a-z]+[0-9A-Za-z]+$/)
      .description('The users public username')
      .example('yertle-the-turtle'),
    datasets: jsonapiServer.Joi.many('datasets')
      .description('All of the datasets owned by this user')
  },
  examples: [
    {
      id: '42D2F0C8-407D-48DB-A944-D6D68D28DE2A',
      type: 'user',
      username: 'demo-user',
      datasets: [
        { type: 'dataset', id: '1610F581-4E44-4161-9220-1809948BC9F5' },
        { type: 'dataset', id: 'F6E7A2B8-F522-411F-BA1E-C28AB85A4E7C' }
      ]
    }
  ]
})
