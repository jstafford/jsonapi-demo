import React, {Component} from 'react'
import {connect} from 'react-redux'
import {readEndpoint} from 'redux-json-api'
import UserSummary from './UserSummary'
import user from '../user'

class UsersRender extends Component<{
  users: Array<user>,
  getUsers: () => void
}> {
  componentWillMount() {
    const {getUsers} = this.props
    getUsers()
  }

  render() {
    const {users} = this.props
    return (
      <ul>
        {users && users.map(user => (
          <UserSummary key={user.id} userid={user.id}/>
        ))}
      </ul>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const users = state.api.users ? state.api.users.data : null
  return {
    users
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  getUsers: () => {
    dispatch(readEndpoint('users?include=tables'))
  }
})

const Users = connect(mapStateToProps, mapDispatchToProps)(UsersRender)

export default Users
