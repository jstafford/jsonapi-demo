import resource from './resource'

class user extends resource {
  constructor(id, attributes, links, relationships) {
    super('users', attributes, links, relationships)
  }
}

export default user
