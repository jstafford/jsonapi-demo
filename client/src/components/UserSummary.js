import {ensureResource, safeGet} from 'jsonapi-client-redux'
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
        <li><Link to={`/user/${data.id}/tables`}>{data.attributes.name}</Link><br />
          <span style={{
            fontSize: 'small',
          }}>
            Followers: {data.attributes.followersCount} Tables: {data.attributes.tablesCount} Member Since: {data.attributes.createdDate} Last Active: {data.attributes.updatedDate}
          </span>
        </li>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const data = safeGet(state, ['api', 'resources', 'users', ownProps.userid], null)
  return {
    data
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  ensureUser: (id) => {
    dispatch(ensureResource('users', id))
  },
})


const UserSummary = connect(mapStateToProps, mapDispatchToProps)(UserSummaryRender)

export default UserSummary
