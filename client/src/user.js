import resource from './resource'

class user extends resource {
  constructor(id, attributes, links, relationships) {
    super('user', attributes, links, relationships)
  }
}

export default user
