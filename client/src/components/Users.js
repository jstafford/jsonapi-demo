import React, {Component} from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {connect} from 'react-redux'
import {readEndpoint, safeGet} from 'jsonapi-client-redux'
import {setUsersSort} from '../appreducer'
import Progress from './Progress'
import UsersSortMenuButton from './UsersSortMenuButton'
import UserSummary from './UserSummary'

class UsersRender extends Component < {
  usersSort: string,
  usersIds: Array<string>,
  total: number,
  changeSort: (usersSort) => void,
  sortUsers: (usersSort) => void,
  loadMoreUsers: (usersSort, offset) => void
} > {
  componentWillMount() {
    const {loadMoreUsers, usersSort} = this.props
    loadMoreUsers(usersSort, 0)
  }

  handleSelection = (value, e) => {
    const {sortUsers, changeSort, usersSort} = this.props
    if (value !== usersSort) {
      changeSort(value)
      sortUsers(value)
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
        <header>
          <span
            style={{
              fontSize: 'large',
              fontWeight: 'bold'
            }}>Users
          </span>
          <UsersSortMenuButton onSelection={this.handleSelection} selectedValue={usersSort}/>
        </header>
        <div
        style={{
          bottom: '0px',
          left: '0px',
          margin: '0px',
          overflow: 'auto',
          position: 'absolute',
          right: '0px',
          top: '50px',
        }}>
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMore}
            hasMore={usersIds ? usersIds.length < total : true}
            loader={<Progress/>}
            useWindow={false}
          >
            <ul >
              {usersIds && usersIds.map(id => (
                <UserSummary key={id} userid={id}/>
              ))}
            </ul>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const usersSort = state.app.usersSort
  const sortKey = `sort=${usersSort}`
  const usersIds = safeGet(state, ['api', 'sorts', 'users', sortKey, 'ids'], null)
  const total = safeGet(state, ['api', 'sorts', 'users', sortKey, 'total'], null)
  return {
    usersSort,
    usersIds,
    total,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeSort: (usersSort) => {
    dispatch(setUsersSort(usersSort))
  },
  loadMoreUsers: (usersSort, offset) => {
    dispatch(
      readEndpoint(`users?sort=${usersSort}&page[limit]=50&page[offset]=${offset}`)
    )
  },
  sortUsers: (usersSort) => {
    dispatch(readEndpoint(`users?sort=${usersSort}`))
  }
})

const Users = connect(mapStateToProps, mapDispatchToProps)(UsersRender)

export default Users
