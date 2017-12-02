'use strict'

const jsonapiServer = require('jsonapi-server')
const rowsHandler = require('../handlers/rowsHandler.js')

jsonapiServer.define({
  namespace: 'json:api',
  resource: 'rows',
  description: 'Represents one rows from a certain dataset.',
  handlers: rowsHandler,
  searchParams: {},
  attributes: {
    values: jsonapiServer.Joi.array().items(
        jsonapiServer.Joi.string().allow(null),
        jsonapiServer.Joi.number(),
        jsonapiServer.Joi.date(),
        jsonapiServer.Joi.boolean()
      ).sparse(true)
      .description('The row of one dataset')
      .example('["Chongqing","China",30165500]'),
    dataset: jsonapiServer.Joi.one('datasets')
      .description('The dataset that contains this row'),
  },
  examples: [
    {
      id: '53F19078-942C-4C0F-9972-0C11038FE646',
      type: 'rows',
      values: ['Chongqing','China',30165500],
      dataset: {
        type: 'datasets',
        id: 'A2930D1F-BB4B-4AA3-8A77-6752A17D3A38',
      }
    },
    {
      id: '1D2267EE-BBB1-4A96-9A43-6FE35E8F52C4',
      type: 'rows',
      values: ['Shanghai','China',24256800],
      dataset: {
        type: 'datasets',
        id: 'A2930D1F-BB4B-4AA3-8A77-6752A17D3A38',
      }
    },
    {
      id: '5167F2DC-FFE7-4B25-AB0B-3F2F46782D95',
      type: 'rows',
      values: ['Delhi','India',21678794],
      dataset: {
        type: 'datasets',
        id: 'A2930D1F-BB4B-4AA3-8A77-6752A17D3A38',
      }
    },
    {
      id: 'A3BE1523-EED8-4337-8A60-96B94267F9AE',
      type: 'rows',
      values: [1,3,'Norway',7.537,0.039,1.616,1.534,0.797,0.635,0.362,0.316,2.277],
      dataset: {
        type: 'datasets',
        id: 'F6E7A2B8-F522-411F-BA1E-C28AB85A4E7C',
      }
    },
    {
      id: '982C8125-A3A2-4DBD-B30F-8750052AF060',
      type: 'rows',
      values: [2,-1,'Denmark',7.522,-0.004,1.482,1.551,0.793,0.626,0.355,0.401,2.314],
      dataset: {
        type: 'datasets',
        id: 'F6E7A2B8-F522-411F-BA1E-C28AB85A4E7C',
      }
    },
    {
      id: '677EA8F6-59D1-4FC8-9954-57632B63093A',
      type: 'rows',
      values: [3,0,'Iceland',7.504,0.003,1.481,1.611,0.834,0.627,0.476,0.154,2.323],
      dataset: {
        type: 'datasets',
        id: 'F6E7A2B8-F522-411F-BA1E-C28AB85A4E7C',
      }
    },
    {
      id: '119B32BC-ED10-4920-8E35-76FBF58CEA21',
      type: 'rows',
      values: [4,-2,'Switzerland',7.494,-0.015,1.565,1.517,0.858,0.620,0.291,0.367,2.277],
      dataset: {
        type: 'datasets',
        id: 'F6E7A2B8-F522-411F-BA1E-C28AB85A4E7C',
      }
    },
    {
      id: 'C9BC9FBC-433D-45E9-9171-1F865E5469BA',
      type: 'rows',
      values: [5,0,'Finland',7.469,0.056,1.444,1.540,0.809,0.618,0.245,0.383,2.430],
      dataset: {
        type: 'datasets',
        id: 'F6E7A2B8-F522-411F-BA1E-C28AB85A4E7C',
      }
    }
  ]
})
