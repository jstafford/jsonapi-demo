import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link, Switch, Route} from 'react-router-dom'
import {ensureResource, safeGet} from 'jsonapi-client-redux'
import user from '../user'
import ButtonNavBar from './ButtonNavBar'
import Progress from './Progress'
import UserFollowers from './UserFollowers'
import UserFollowing from './UserFollowing'
import UserTables from './UserTables'

class UserViewRender extends Component<{
  data: user,
  userid: string,
  ensureUser: (id:string) => void,
}> {
  componentWillMount () {
    const {ensureUser, userid} = this.props
    if (userid) {
      ensureUser(userid)
    }
  }

  render() {
    const {data} = this.props
    if (data) {
      const navItems = [
        {
          to:`/user/${data.id}/tables`,
          label: 'Tables',
        }, {
          to:`/user/${data.id}/following`,
          label: 'Following',
        }, {
          to:`/user/${data.id}/followers`,
          label: 'Followers',
        },
      ]
      return (
        <div>
          <header>
            <Link to={'/'}>All Users</Link>
            <h1>{data.attributes.name}</h1>
            <p style={{
              fontSize: 'small',
            }}>Following: {safeGet(data, ['relationships', 'follows', 'data', 'length'], 0)} Followers: {data.attributes.followersCount} Tables: {data.attributes.tablesCount} Member Since: {data.attributes.createdDate} Last Active: {data.attributes.updatedDate}</p>
          <ButtonNavBar navItems={navItems}/>
          </header>
          <Switch>
            <Route path="/user/:userid/tables" component={UserTables}/>
            <Route path="/user/:userid/following" component={UserFollowing}/>
            <Route path="/user/:userid/followers" component={UserFollowers}/>
            <Route path="/user/:userid" component={UserTables}/>
          </Switch>
        </div>
      )
    } else {
      return (
        <div>
          <Link to={'/'}>All Users</Link>
          <Progress/>
        </div>
      )
    }
  }
}

const mapState = (state: GenericMap, ownProps: Object): Object => {
  const userid = ownProps.match.params.userid
  const data = safeGet(state, ['api', 'resources', 'users', userid], null)
  return {
    data,
    userid,
  }
}

const mapDisp = (dispatch: Dispatch<Action>, ownProps: Object): Object => (
  {
    ensureUser: (id) => {
      dispatch(ensureResource('users', id))
    },
  }
)

const UserView = connect(mapState, mapDisp)(UserViewRender)
export default UserView
