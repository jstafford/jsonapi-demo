import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import user from '../user'
import Dataset from './Dataset'

class UserRender extends Component<{
  data: user,
  userid: string,
}> {
  render() {
    const {data} = this.props
    if (data) {
      const datasets = data.relationships && data.relationships.datasets && data.relationships.datasets.data
        ? data.relationships.datasets.data
        : null
      return (
        <li><Link to={`/user/${data.id}`}>{data.attributes.username}</Link>
          {datasets && <ul>{datasets.map(dataset => (
            <Dataset key={dataset.id} datasetid={dataset.id}/>
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
