import resource from './resource'

class dataset extends resource {
  constructor(id, attributes, links, relationships) {
    super('tables', attributes, links, relationships)
  }
}

export default dataset
