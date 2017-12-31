'use strict'

const jsonapiServer = require('jsonapi-server')
const tableinfosHandler = require('../handlers/tableinfosHandler.js')

jsonapiServer.define({
  namespace: 'json:api',
  resource: 'tableinfos',
  description: 'Represents the meta info about a given table.',
  handlers: tableinfosHandler,
  searchParams: {},
  attributes: {
    title: jsonapiServer.Joi.string()
      .description('The table title')
      .example('World’s Larget Cities'),
    description: jsonapiServer.Joi.string()
      .description('A concise description of the tabe.')
      .example('List of largest cites using the city proper administrative boundaries to determine population.'),
    fields: jsonapiServer.Joi.array().items(jsonapiServer.Joi.object().keys({
        title: jsonapiServer.Joi.string(),
        description: jsonapiServer.Joi.string(),
      }).allow(null))
      .description('Definition for the fields of the table')
      .example('[{"title":"City"},{"title":"Nation"},{"title":"Population"}]'),
    owner: jsonapiServer.Joi.one('users')
      .description('The user who controls this table'),
    tags: jsonapiServer.Joi.many('tags')
      .description('Tags for the table'),
    table: jsonapiServer.Joi.one('tables')
      .description('The table that this info is about'),

    // server side managed data (read only to clients)
    createdDate: jsonapiServer.Joi.date().iso().allow(null).meta('readonly').description('Read only date table created.'),
    columnsCount: jsonapiServer.Joi.number().integer().allow(null).meta('readonly').description('Read only count of columns in table.'),
    rowsCount: jsonapiServer.Joi.number().integer().allow(null).meta('readonly').description('Read only count of rows in table.'),
    updatedDate: jsonapiServer.Joi.date().iso().allow(null).meta('readonly').description('Read only date table last modified.'),
    starsCount: jsonapiServer.Joi.number().integer().allow(null).meta('readonly').description('Read only count of stars for table.'),
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
      owner: {
        type: 'users',
        id: '42D2F0C8-407D-48DB-A944-D6D68D28DE2A',
      },
      table: {
        type: 'tables',
        id: 'AB0943D3-7540-4DCB-AE33-7726F14EA17F',
      },
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
      owner: {
        type: 'users',
        id: '42D2F0C8-407D-48DB-A944-D6D68D28DE2A',
      },
      table: {
        type: 'tables',
        id: 'BDA58C68-867D-4B31-9EED-CBB083FA76ED',
      },
    }
  ]
})
