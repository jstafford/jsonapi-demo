'use strict'

const jsonapiServer = require('jsonapi-server')
const datasetHandler = require('../handlers/datasetHandler.js')

jsonapiServer.define({
  namespace: 'json:api',
  resource: 'datasets',
  description: 'Represents the rows and columns of one dataset.',
  handlers: datasetHandler,
  searchParams: {},
  attributes: {
    title: jsonapiServer.Joi.string()
      .description('The dataset title')
      .example('World’s Larget Cities'),
    columns: jsonapiServer.Joi.array().items(jsonapiServer.Joi.object().keys({
        title: jsonapiServer.Joi.string()
      }))
      .description('Definition for the columns of the dataset')
      .example('[{"title":"City"},{"title":"Nation"},{"title":"Population"}]'),
    rows: jsonapiServer.Joi.many('rows')
      .description('The rows of the dataset'),
    owner: jsonapiServer.Joi.one('users')
      .description('The user who controls this dataset'),
  },
  examples: [
    {
      id: 'A2930D1F-BB4B-4AA3-8A77-6752A17D3A38',
      type: 'datasets',
      title: 'World’s Larget Cities',
      columns: [
        {title: 'City'},
        {title: 'Nation'},
        {title: 'Population'},
      ],
      rows: [
        {type: 'rows', id: '53F19078-942C-4C0F-9972-0C11038FE646'},
        {type: 'rows', id: '1D2267EE-BBB1-4A96-9A43-6FE35E8F52C4'},
        {type: 'rows', id: '5167F2DC-FFE7-4B25-AB0B-3F2F46782D95'},
      ],
      owner: {
        type: 'users',
        id: '42D2F0C8-407D-48DB-A944-D6D68D28DE2A',
      }
    },
    {
      id: 'F6E7A2B8-F522-411F-BA1E-C28AB85A4E7C',
      type: 'datasets',
      title: '2017 World Happiness Report',
      columns: [
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
        {type: 'rows', id: 'A3BE1523-EED8-4337-8A60-96B94267F9AE'},
        {type: 'rows', id: '982C8125-A3A2-4DBD-B30F-8750052AF060'},
        {type: 'rows', id: '677EA8F6-59D1-4FC8-9954-57632B63093A'},
        {type: 'rows', id: '119B32BC-ED10-4920-8E35-76FBF58CEA21'},
        {type: 'rows', id: 'C9BC9FBC-433D-45E9-9171-1F865E5469BA'}
      ],
      owner: {
        type: 'users',
        id: '42D2F0C8-407D-48DB-A944-D6D68D28DE2A',
      }
    }
  ]
})
