import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import table from '../table'

class TableRender extends Component<{
  tableid: string,
  data: table,
}> {
  render() {
    const {data} = this.props
    if (data) {
      return (
        <li><Link to={`/table/${data.id}`}>{data.attributes.title}</Link></li>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const index = state.resourceIndex.tables ? state.resourceIndex.tables[ownProps.tableid] : undefined
  const data = index !== undefined ? state.api.tables.data[index] : null
  return {
    data
  }
}

const Table = connect(mapStateToProps, null)(TableRender)

export default Table
