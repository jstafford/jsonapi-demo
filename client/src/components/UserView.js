import React, {Component} from 'react'
import {connect} from 'react-redux'
import {ensureResource} from '../resourceIndexMiddleware'
import User from './User'

class UserViewRender extends Component<{
  userid : String,
  ensureUser : (id:string) => void
}> {
  componentWillMount () {
    const {ensureUser, userid} = this.props
    if (userid) {
      ensureUser(userid)
    }
  }

  render() {
    const {userid} = this.props
    if (userid) {
      return (
        <User userid={userid}/>
      )
    } else {
      return null
    }
  }
}

const mapState = (state: GenericMap, ownProps: Object): Object => {
  return {
    userid: ownProps.match.params.userid,
  }
}

const mapDisp = (dispatch: Dispatch<Action>, ownProps: Object): Object => (
  {
    ensureUser: (id:string): void => {
      dispatch(ensureResource({type:'user', id}))
    }
  }
)

const UserView = connect(mapState, mapDisp)(UserViewRender)
export default UserView
