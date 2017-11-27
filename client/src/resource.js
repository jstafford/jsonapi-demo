class resource extends Object {
  constructor(type, id, attributes, links, relationships) {
    super()
    this.type = type
    this.id = id
    this.attributes = attributes
    this.links = links
    this.relationships = relationships
  }
}

// {
//   "type":"user",
//   "id":"42D2F0C8-407D-48DB-A944-D6D68D28DE2A",
//   "attributes":{
//     "username":"demo-user"
//   },
//   "links":{
//     "self":"http://localhost:8443/jsonapi/user/42D2F0C8-407D-48DB-A944-D6D68D28DE2A"
//   },
//   "relationships":{
//     "datasets":{
//       "meta":{
//         "relation":"primary",
//         "readOnly":false
//       },
//       "links":{
//         "self":"http://localhost:8443/jsonapi/user/42D2F0C8-407D-48DB-A944-D6D68D28DE2A/relationships/datasets",
//         "related":"http://localhost:8443/jsonapi/user/42D2F0C8-407D-48DB-A944-D6D68D28DE2A/datasets"
//       },
//       "data":[
//         {
//           "type":"dataset",
//           "id":"1610F581-4E44-4161-9220-1809948BC9F5"
//         },
//         {
//           "type":"dataset",
//           "id":"F6E7A2B8-F522-411F-BA1E-C28AB85A4E7C"
//         }
//       ]
//     }
//   }
// }

export default resource
