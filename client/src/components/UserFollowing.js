import _ from 'lodash'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {ensureResource, safeGet} from 'jsonapi-client-redux'
import {setUsersSort} from '../appreducer'
import user from '../user'
import MenuButton from './MenuButton'
import Progress from './Progress'
import UserSummary from './UserSummary'

class UserFollowingRender extends Component<{
  user: user,
  userid: string,
  usersIds: Array<string>,
  usersSort: string,
  changeSort: (usersSort) => void,
}> {
  componentWillMount() {
    const {ensureUser, userid} = this.props
    if (userid) {
      ensureUser(userid)
    }
  }

  handleSelection = (value, e) => {
    const {changeSort, usersSort} = this.props
    if (value !== usersSort) {
      changeSort(value)
    }
  }

  render() {
    const {user, users, usersSort} = this.props
    let usersIds
    if (user && users) {
      let followingUsers = user.relationships.follows.data.map((followUser) => safeGet(users, [followUser.id], undefined))
      if (usersSort) {
        const sortAttribute = usersSort.replace('-', '')
        followingUsers = _.sortBy(followingUsers, [(followUser) => (followUser ? followUser.attributes[sortAttribute] : undefined)])
        if (usersSort.startsWith('-')) {
          _.reverse(followingUsers)
        }
      }
      usersIds = followingUsers.map((followUser) => (followUser ? followUser.id : undefined))
      const menuItems = [
        {
          title: 'Default',
          value: ''
        }, {
          title: 'Most followers',
          value: '-followersCount'
        }, {
          title: 'Fewest followers',
          value: 'followersCount'
        }, {
          title: 'Most tables',
          value: '-tablesCount'
        }, {
          title: 'Fewest tables',
          value: 'tablesCount'
        }, {
          title: 'Most recently joined',
          value: '-createdDate'
        }, {
          title: 'Least recently joined',
          value: 'createdDate'
        }, {
          title: 'Most recently active',
          value: '-updatedDate'
        }, {
          title: 'Least recently active',
          value: 'updatedDate'
        }, {
          title: 'User name A to Z',
          value: 'name'
        }, {
          title: 'User name Z to A',
          value: '-name'
        }
      ]
      const curSortTitle = menuItems
        .filter(item => (item.value === usersSort))[0]
        .title
      return (
        <div>
          <div style={{
            bottom: '0px',
            left: '0px',
            margin: '0px',
            overflow: 'auto',
            position: 'absolute',
            right: '0px',
            top: '170px',
          }}>
            <MenuButton menuItems={menuItems} onSelection={this.handleSelection} selectedValue={usersSort} title={`Sort: ${curSortTitle}`}/>
            <div style={{
                overflow: 'auto'
              }}
            >
              <ul >
                {usersIds && usersIds.map(id => (
                  id ? <UserSummary key={id} userid={id}/> : null
                ))}
              </ul>
            </div>
          </div>
        </div>
      )
    } else {
      return (<Progress/>)
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const userid = ownProps.match.params.userid
  const usersSort = state.app.usersSort
  const user = safeGet(state, ['api', 'resources', 'users', userid], null)
  const users = safeGet(state, ['api', 'resources', 'users'], null)
  return {
    user,
    users,
    userid,
    usersSort,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeSort: (usersSort) => {
    dispatch(setUsersSort(usersSort))
  },
  ensureUser: (id) => {
    dispatch(ensureResource('users', id, 'follows'))
  },
})

const UserFollowing = connect(mapStateToProps, mapDispatchToProps)(UserFollowingRender)

export default UserFollowing
