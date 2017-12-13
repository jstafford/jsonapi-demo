'use strict'

const config = require('../config')

const PostgresHandler = require('./PostgresHandler')

const usersHandler = new PostgresHandler(config)

module.exports = usersHandler
