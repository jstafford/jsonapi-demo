'use strict'

const config = require('../config')

const PostgresHandler = require('./PostgresHandler')

const tablesHandler = new PostgresHandler(config)

module.exports = tablesHandler
