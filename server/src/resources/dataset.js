'use strict'

const jsonapiServer = require('jsonapi-server')
const datasetHandler = require('../handlers/datasetHandler.js')

// const column = jsonapiServer.Joi.object().keys({
//   title: jsonapiServer.Joi.string()
// })
//
// const row = jsonapiServer.Joi.array().items(
//   jsonapiServer.Joi.string(),
//   jsonapiServer.Joi.number(),
//   jsonapiServer.Joi.date(),
//   jsonapiServer.Joi.boolean()
// )
//

jsonapiServer.define({
  namespace: 'json:api',
  resource: 'dataset',
  description: 'Represents the rows and columns of one dataset.',
  handlers: datasetHandler,
  searchParams: {},
  attributes: {
    title: jsonapiServer.Joi.string().required()
      .description('The dataset title')
      .example('World’s Larget Cities'),
    columns: jsonapiServer.Joi.array().items(jsonapiServer.Joi.object().keys({
        title: jsonapiServer.Joi.string()
      }))
      .description('Definition for the columns of the dataset')
      .example('[{"title":"City"},{"title":"Nation"},{"title":"Population"}]'),
    rows: jsonapiServer.Joi.array().items(jsonapiServer.Joi.array().items(
        jsonapiServer.Joi.string(),
        jsonapiServer.Joi.number(),
        jsonapiServer.Joi.date(),
        jsonapiServer.Joi.boolean()
      ))
      .description('The rows of the dataset')
      .example('[["Chongqing","China",30165500],["Shanghai","China",24256800],["Delhi","India",21678794]]'),
    owner: jsonapiServer.Joi.one('user')
      .description('The user who controls this dataset'),
  },
  examples: [
    {
      id: 'A2930D1F-BB4B-4AA3-8A77-6752A17D3A38',
      type: 'dataset',
      title: 'World’s Larget Cities',
      columns: [
        {title: 'City'},
        {title: 'Nation'},
        {title: 'Population'},
      ],
      rows: [
        ["Chongqing","China",30165500],
        ["Shanghai","China",24256800],
        ["Delhi","India",21678794],
      ],
      owner: {
        type: 'user',
        id: '42D2F0C8-407D-48DB-A944-D6D68D28DE2A',
      }
    }
  ]
})
