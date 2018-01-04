import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {safeGet} from 'jsonapi-client-redux'
import table from '../table'
import TagBar from './TagBar'

class TableRender extends Component<{
  tableid: string,
  data: table,
  onTagClick: (tag) => void,
}> {
  render() {
    const {data, onTagClick} = this.props
    if (data) {
      return (
        <li>
          <Link to={`/table/${data.id}`}>{data.attributes.title}</Link>
          <span style={{
            fontSize: 'small',
          }}> ★: {data.attributes.starsCount} Columns: {data.attributes.columnsCount} Rows: {data.attributes.rowsCount} Created: {data.attributes.createdDate} Updated: {data.attributes.updatedDate} Tags: <TagBar onTagClick={onTagClick} tags={data.relationships.tags.data}/>
          </span>
      </li>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const data = safeGet(state, ['api', 'resources', 'tableinfos', ownProps.tableid], null)
  return {
    data
  }
}

const Table = connect(mapStateToProps, null)(TableRender)

export default Table
