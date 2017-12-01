'use strict'

const jsonapiStoreRelationaldb = require('jsonapi-store-relationaldb')
const config = require('../config')

module.exports = new jsonapiStoreRelationaldb(config)
