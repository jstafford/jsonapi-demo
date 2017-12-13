import resource from './resource'

class table extends resource {
  constructor(id, attributes, links, relationships) {
    super('tables', attributes, links, relationships)
  }
}

export default table
