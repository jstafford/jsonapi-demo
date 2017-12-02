'use strict'

const jsonapiServer = require('jsonapi-server')
const columnsHandler = require('../handlers/columnsHandler')

jsonapiServer.define({
  namespace: 'json:api',
  resource: 'columns',
  description: 'Represents the meta info for a column of some dataset.',
  handlers: columnsHandler,
  searchParams: {},
  attributes: {
    title: jsonapiServer.Joi.string()
      .description('Display title for this column')
      .example('Name'),
    dataset: jsonapiServer.Joi.one('datasets')
    .description('The dataset that contains this column'),
  },
  examples: [
    {
      id: '4F3EDA52-4C60-45DE-968B-A86E5E2C3ADE',
      type: 'columns',
      title: 'City',
      dataset: {
        type: 'datasets',
        id: 'A2930D1F-BB4B-4AA3-8A77-6752A17D3A38',
      }
    },
    {
      id: '9E085C53-CFC1-43DC-8F3C-344C0F7D28F2',
      type: 'columns',
      title: 'Nation',
      dataset: {
        type: 'datasets',
        id: 'A2930D1F-BB4B-4AA3-8A77-6752A17D3A38',
      }
    },
    {
      id: '8758332A-11B6-48EA-8297-085C24679CC5',
      type: 'columns',
      title: 'Population',
      dataset: {
        type: 'datasets',
        id: 'A2930D1F-BB4B-4AA3-8A77-6752A17D3A38',
      }
    }
  ]
})
