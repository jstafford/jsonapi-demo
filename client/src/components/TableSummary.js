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
          }}> Columns: {data.attributes.fields.length} Rows: {data.attributes.rows.length}
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
