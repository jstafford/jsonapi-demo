'use strict'

const jsonapiServer = require('jsonapi-server')
const tablesHandler = require('../handlers/tablesHandler.js')

jsonapiServer.define({
  namespace: 'json:api',
  resource: 'tables',
  description: 'Represents the rows and fields of one table.',
  handlers: tablesHandler,
  searchParams: {},
  attributes: {
    fields: jsonapiServer.Joi.array().items(jsonapiServer.Joi.object().keys({
        name: jsonapiServer.Joi.string(),
        type: jsonapiServer.Joi.string().valid('string', 'number', 'integer', 'boolean', 'date', 'time', 'datetime', 'year', 'yearmonth', 'geopoint')
      }).allow(null))
      .description('Definition for the fields of the table')
      .example('[{"name":"city"},{"name":"nation"},{"name":"population"}]'),
    rows: jsonapiServer.Joi.array().items(jsonapiServer.Joi.array().items(
        jsonapiServer.Joi.string().allow(null),
        jsonapiServer.Joi.number(),
        jsonapiServer.Joi.date(),
        jsonapiServer.Joi.boolean()
      ).sparse(true).allow(null)).sparse(true)
      .description('The rows of the table')
      .example('[["Chongqing","China",30165500],["Shanghai","China",24256800],["Delhi","India",21678794]]'),
    stats: jsonapiServer.Joi.array().items(jsonapiServer.Joi.array().items(
        jsonapiServer.Joi.object().keys({
          name: jsonapiServer.Joi.string().allow('min', 'mean', 'median', 'max', 'total', 'true', 'false', 'center', 'northmost', 'southmost', null),
          value: jsonapiServer.Joi.any().allow(null),
        }).allow(null)
      ).sparse(true)).sparse(true)
      .description('Array of statistics for the each row, arranged by column')
      .example('[[{"name":"min","value":0},{"name":"mean","value":50},{"name":"max","value":100}],[{"name":"true","value":45},{"name":"false","value":55}],[{"name":"center","value":"-98.5795, 39.8283"},{"name":"northmost","value":"-156.47741, 71.39040"},{"name":"southmost","value":"-155.67927, 18.91023"}]]'),
    info: jsonapiServer.Joi.one('tableinfos')
      .description('The meta info about this table'),
  },
  examples: [
    {
      id: 'AB0943D3-7540-4DCB-AE33-7726F14EA17F',
      type: 'tables',
      fields: [
        {name: 'city', type: 'string'},
        {name: 'nation', type: 'string'},
        {name: 'population', type: 'integer'},
      ],
      rows: [
        ['Chongqing','China',30165500],
        ['Shanghai','China',24256800],
        ['Delhi','India',21678794],
      ],
      info: {
        type: 'tableinfos',
        id: 'A2930D1F-BB4B-4AA3-8A77-6752A17D3A38',
      },
    },
    {
      id: 'BDA58C68-867D-4B31-9EED-CBB083FA76ED',
      type: 'tables',
      fields: [
        {name: 'overall_rank', type: 'integer'},
        {name: 'change_in_rank', type: 'integer'},
        {name: 'country', type: 'string'},
        {name: 'score', type: 'number'},
        {name: 'change_in_score', type: 'number'},
        {name: 'gdp_per_capita', type: 'number'},
        {name: 'social_support', type: 'number'},
        {name: 'healthy_life_expectancy', type: 'number'},
        {name: 'freedom_to_make_life_choices', type: 'number'},
        {name: 'generosity', type: 'number'},
        {name: 'trust', type: 'number'},
        {name: 'residual', type: 'number'},
      ],
      rows: [
        [1,3,'Norway',7.537,0.039,1.616,1.534,0.797,0.635,0.362,0.316,2.277],
        [2,-1,'Denmark',7.522,-0.004,1.482,1.551,0.793,0.626,0.355,0.401,2.314],
        [3,0,'Iceland',7.504,0.003,1.481,1.611,0.834,0.627,0.476,0.154,2.323],
        [4,-2,'Switzerland',7.494,-0.015,1.565,1.517,0.858,0.620,0.291,0.367,2.277],
        [5,0,'Finland',7.469,0.056,1.444,1.540,0.809,0.618,0.245,0.383,2.430],
      ],
      info: {
        table: 'tableinfos',
        id: 'F6E7A2B8-F522-411F-BA1E-C28AB85A4E7C',
      }
    }
  ]
})
