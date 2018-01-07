import React, {Component} from 'react'
import {connect} from 'react-redux'
import {readEndpoint, safeGet} from '../jsonapi-client-redux'
import {setUsersSort} from '../appreducer'
import InfiniteScroll from './InfiniteScroll'
import UsersSortMenuButton from './UsersSortMenuButton'
import UserSummary from './UserSummary'

class UserFollowersRender extends Component<{
  total: number,
  userid: string,
  usersIds: Array<string>,
  usersSort: string,
  changeSort: (usersSort) => void,
  sortUsers: (userid, usersSort) => void,
  loadMoreUsers: (userid, usersSort, offset) => void
}> {
  componentWillMount() {
    const {loadMoreUsers, userid, usersSort} = this.props
    loadMoreUsers(userid, usersSort, 0)
  }

  handleSelection = (value, e) => {
    const {sortUsers, changeSort, userid, usersSort} = this.props
    if (value !== usersSort) {
      changeSort(value)
      sortUsers(userid, value)
    }
  }

  loadMore = (page) => {
    const {loadMoreUsers, usersSort, usersIds} = this.props
    if (usersIds) {
      loadMoreUsers(usersSort, usersIds.length)
    }
  }

  render() {
    const {usersSort, usersIds, total} = this.props
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
          <UsersSortMenuButton onSelection={this.handleSelection} selectedValue={usersSort}/>
          <InfiniteScroll
            loadMore={this.loadMore}
            hasMore={usersIds ? usersIds.length < total : true}
          >
            <ul >
              {usersIds && usersIds.map(id => (
                <UserSummary key={id} userid={id}/>
              ))}
            </ul>
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const userid = ownProps.match.params.userid
  const usersSort = state.app.usersSort
  const sortKey = `sort=${usersSort}&filter[follows][id]=${userid}`
  const usersIds = safeGet(state, ['api', 'sorts', 'users', sortKey, 'ids'], null)
  const total = safeGet(state, ['api', 'sorts', 'users', sortKey, 'total'], null)
  return {
    total,
    userid,
    usersIds,
    usersSort,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeSort: (usersSort) => {
    dispatch(setUsersSort(usersSort))
  },
  loadMoreUsers: (userid, usersSort, offset) => {
    dispatch(
      readEndpoint(`users?sort=${usersSort}&filter[follows][id]=${userid}&page[limit]=50&page[offset]=${offset}`)
    )
  },
  sortUsers: (userid, usersSort) => {
    dispatch(readEndpoint(`users?sort=${usersSort}&filter[follows][id]=${userid}`))
  }
})

const UserFollowers = connect(mapStateToProps, mapDispatchToProps)(UserFollowersRender)

export default UserFollowers
