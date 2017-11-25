'use strict'

const jsonapiServer = require('jsonapi-server')
const fs = require('fs')
const path = require('path')
const debug = require('debug')

jsonapiServer.setConfig({
  graphiql: false,
  swagger: {
    title: 'JSON:API Demo Server',
    version: '1.0.0',
    description: 'This is the API description block that shows up in the swagger.json',
    termsOfService: 'http://example.com/termsOfService',
    contact: {
      name: 'API Contact',
      email: 'apicontact@holidayextras.com',
      url: 'docs.hapi.holidayextras.com'
    },
    license: {
      name: 'MIT',
      url: 'http://opensource.org/licenses/MIT'
    },
    security: [
      {
        'APIKeyHeader': []
      }
    ],
    securityDefinitions: {
      APIKeyHeader: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Auth'
      }
    }
  },
  protocol: 'http',
  hostname: 'localhost',
  port: 8443,
  base: 'jsonapi',
})

jsonapiServer.authenticate((request, callback) => {
  // If a "blockMe" header is provided, block access.
  if (request.headers.blockme) return callback(new Error('Fail'))

  // If a "blockMe" cookie is provided, block access.
  if (request.cookies.blockMe) return callback(new Error('Fail'))

  return callback()
})

fs.readdirSync(path.join(__dirname, '/resources')).filter(filename => /^[a-z].*\.js$/.test(filename)).map(filename => path.join(__dirname, '/resources/', filename)).forEach(require)

jsonapiServer.onUncaughtException((request, error) => {
  const errorDetails = error.stack.split('\n')
  console.error(JSON.stringify({
    request,
    error: errorDetails.shift(),
    stack: errorDetails
  }))
})

jsonapiServer.metrics.on('data', data => {
  debug('metrics')(data)
})

jsonapiServer.start()
