'use strict'

const config = require('../config')

const PostgresHandler = require('./PostgresHandler')

const tableinfosHandler = new PostgresHandler(config)

module.exports = tableinfosHandler
