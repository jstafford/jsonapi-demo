import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import user from '../user'
import TableSummary from './TableSummary'

class UserRender extends Component<{
  data: user,
  userid: string,
}> {
  render() {
    const {data} = this.props
    if (data) {
      const tables = data.relationships && data.relationships.tables && data.relationships.tables.data
        ? data.relationships.tables.data
        : null
      return (
        <li><Link to={`/user/${data.id}`}>{data.attributes.username}</Link>
          {tables && <ul>{tables.map(table => (
            <TableSummary key={table.id} tableid={table.id}/>
          ))}</ul>}
        </li>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const index = state.resourceIndex.users ? state.resourceIndex.users[ownProps.userid] : undefined
  const data = index !== undefined ? state.api.users.data[index] : null
  return {
    data
  }
}

const User = connect(mapStateToProps, null)(UserRender)

export default User
