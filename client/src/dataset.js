import resource from './resource'

class dataset extends resource {
  constructor(id, attributes, links, relationships) {
    super('datasets', attributes, links, relationships)
  }
}

export default dataset
