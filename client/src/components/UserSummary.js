import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import user from '../user'

class UserSummaryRender extends Component<{
  data: user,
  userid: string,
}> {
  render() {
    const {data} = this.props
    if (data) {
      const numTables = data.relationships && data.relationships.tables && data.relationships.tables.data
        ? data.relationships.tables.data.length
        : 0
      return (
        <li><Link to={`/user/${data.id}`}>{data.attributes.name}</Link><br />
          <span style={{
            fontSize: 'small',
          }}>
            Tables: {numTables} Member Since: {data.attributes.createdAt}
          </span>
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

const UserSummary = connect(mapStateToProps, null)(UserSummaryRender)

export default UserSummary
