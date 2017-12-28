import React, {Component} from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {connect} from 'react-redux'
import {readEndpoint, safeGet} from 'jsonapi-client-redux'
import {setUsersSort} from '../appreducer'
import MenuButton from './MenuButton'
import Progress from './Progress'
import UserSummary from './UserSummary'

class UsersRender extends Component < {
  sort: string,
  sortIds: Array<string>,
  total: number,
  changeSort: (sort) => void,
  sortUsers: (value, e) => void,
  loadMoreUsers: (sort, offset) => void
} > {
  componentWillMount() {
    const {loadMoreUsers, sort} = this.props
    loadMoreUsers(sort, 0)
  }

  handleSelection = (value, e) => {
    const {sortUsers, changeSort, sort} = this.props
    if (value !== sort) {
      changeSort(value)
      sortUsers(value, e)
    }
  }

  loadMore = (page) => {
    const {loadMoreUsers, sort, sortIds} = this.props
    if (sortIds) {
      loadMoreUsers(sort, sortIds.length)
    }
  }

  render() {
    const {sort, sortIds, total} = this.props
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
      .filter(item => (item.value === sort))[0]
      .title

    return (
      <div>
        <header>
          <span
            style={{
              fontSize: 'large',
              fontWeight: 'bold'
            }}>Users
          </span>
          <MenuButton menuItems={menuItems} onSelection={this.handleSelection} selectedValue={sort} title={`Sort: ${curSortTitle}`}/>
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
            hasMore={sortIds ? sortIds.length < total : true}
            loader={<Progress/>}
            useWindow={false}
          >
            <ul >
              {sortIds && sortIds.map(id => (
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
  const sort = state.app.sort
  const sortKey = `sort=${sort}`
  const sortIds = safeGet(state, ['api', 'sorts', 'users', sortKey, 'ids'], null)
  const total = safeGet(state, ['api', 'sorts', 'users', sortKey, 'total'], null)
  return {
    sort,
    sortIds,
    total,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeSort: (sort) => {
    dispatch(setUsersSort(sort))
  },
  loadMoreUsers: (sort, offset) => {
    dispatch(
      readEndpoint(`users?sort=${sort}&page[limit]=50&page[offset]=${offset}`)
    )
  },
  sortUsers: (value, event) => {
    dispatch(readEndpoint(`users?sort=${value}`))
  }
})

const Users = connect(mapStateToProps, mapDispatchToProps)(UsersRender)

export default Users
