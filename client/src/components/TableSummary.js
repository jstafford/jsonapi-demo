import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {safeGet} from 'jsonapi-client-redux'
import table from '../table'

class TableRender extends Component<{
  tableid: string,
  data: table,
}> {
  render() {
    const {data} = this.props
    if (data) {
      return (
        <li>
          <Link to={`/table/${data.id}`}>{data.attributes.title}</Link>
          <span style={{
            fontSize: 'small',
          }}> ★: {data.meta.starsCount} Columns: {data.meta.columnsCount} Rows: {data.meta.rowsCount} Created: {data.meta.createdDate} Updated: {data.meta.updatedDate}
          </span>
      </li>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const data = safeGet(state, ['api', 'resources', 'tables', ownProps.tableid], null)
  return {
    data
  }
}

const Table = connect(mapStateToProps, null)(TableRender)

export default Table
