'use strict'

const config = require('../config')

const PostgresHandler = require('./PostgresHandler')

const tagsHandler = new PostgresHandler(config)

module.exports = tagsHandler
