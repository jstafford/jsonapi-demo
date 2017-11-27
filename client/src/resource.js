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

export default resource
