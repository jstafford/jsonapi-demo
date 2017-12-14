import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {ensureResource} from '../resourceIndexMiddleware'
import user from '../user'
import TableSummary from './TableSummary'

class UserViewRender extends Component<{
  data: user,
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
    const {data} = this.props
    if (data) {
      const tables = data.relationships && data.relationships.tables && data.relationships.tables.data
        ? data.relationships.tables.data
        : null
      return (
        <div>
          <Link to={'/'}>All Users</Link>
          <h1>{data.attributes.name}</h1>
          <ul>
            <li>Tables</li>
            <ul>
              {tables && tables.map(table => (
                <TableSummary key={table.id} tableid={table.id}/>
              ))}
            </ul>
          </ul>

        </div>
      )
    } else {
      return null
    }
  }
}

const mapState = (state: GenericMap, ownProps: Object): Object => {
  const userid = ownProps.match.params.userid
  const index = state.resourceIndex.users ? state.resourceIndex.users[userid] : undefined
  const data = index !== undefined ? state.api.users.data[index] : null
  return {
    data,
    userid,
  }
}

const mapDisp = (dispatch: Dispatch<Action>, ownProps: Object): Object => (
  {
    ensureUser: (id:string): void => {
      dispatch(ensureResource({type:'users', id, params:'include=tables'}))
    }
  }
)

const UserView = connect(mapState, mapDisp)(UserViewRender)
export default UserView
