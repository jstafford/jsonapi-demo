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
    title: jsonapiServer.Joi.string()
      .description('The table title')
      .example('World’s Larget Cities'),
    fields: jsonapiServer.Joi.array().items(jsonapiServer.Joi.object().keys({
        title: jsonapiServer.Joi.string()
      }).allow(null))
      .description('Definition for the fields of the table')
      .example('[{"title":"City"},{"title":"Nation"},{"title":"Population"}]'),
    rows: jsonapiServer.Joi.array().items(jsonapiServer.Joi.array().items(
        jsonapiServer.Joi.string().allow(null),
        jsonapiServer.Joi.number(),
        jsonapiServer.Joi.date(),
        jsonapiServer.Joi.boolean()
      ).sparse(true)).sparse(true)
      .description('The rows of the table')
      .example('[["Chongqing","China",30165500],["Shanghai","China",24256800],["Delhi","India",21678794]]'),
    owner: jsonapiServer.Joi.one('users')
      .description('The user who controls this table'),
  },
  examples: [
    {
      id: 'A2930D1F-BB4B-4AA3-8A77-6752A17D3A38',
      type: 'tables',
      title: 'World’s Larget Cities',
      fields: [
        {title: 'City'},
        {title: 'Nation'},
        {title: 'Population'},
      ],
      rows: [
        ['Chongqing','China',30165500],
        ['Shanghai','China',24256800],
        ['Delhi','India',21678794],
      ],
      owner: {
        type: 'users',
        id: '42D2F0C8-407D-48DB-A944-D6D68D28DE2A',
      }
    },
    {
      id: 'F6E7A2B8-F522-411F-BA1E-C28AB85A4E7C',
      type: 'tables',
      title: '2017 World Happiness Report',
      fields: [
        {title: 'Overall Rank'},
        {title: 'Change in rank'},
        {title: 'Country'},
        {title: 'Score'},
        {title: 'Change in score'},
        {title: 'GDP per capita'},
        {title: 'Social support'},
        {title: 'Healthy life expectancy'},
        {title: 'Freedom to make life choices'},
        {title: 'Generosity'},
        {title: 'Trust'},
        {title: 'Residual'},
      ],
      rows: [
        [1,3,'Norway',7.537,0.039,1.616,1.534,0.797,0.635,0.362,0.316,2.277],
        [2,-1,'Denmark',7.522,-0.004,1.482,1.551,0.793,0.626,0.355,0.401,2.314],
        [3,0,'Iceland',7.504,0.003,1.481,1.611,0.834,0.627,0.476,0.154,2.323],
        [4,-2,'Switzerland',7.494,-0.015,1.565,1.517,0.858,0.620,0.291,0.367,2.277],
        [5,0,'Finland',7.469,0.056,1.444,1.540,0.809,0.618,0.245,0.383,2.430],
      ],
      owner: {
        type: 'users',
        id: '42D2F0C8-407D-48DB-A944-D6D68D28DE2A',
      }
    }
  ]
})
