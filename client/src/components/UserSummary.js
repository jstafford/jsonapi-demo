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
      return (
        <li><Link to={`/user/${data.id}`}>{data.attributes.name}</Link><br />
          <span style={{
            fontSize: 'small',
          }}>
            ★: {data.attributes.stars} Tables: {data.attributes.tablesCount} Member Since: {data.attributes.joinDate}
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
