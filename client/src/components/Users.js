import React, {Component} from 'react'
import {Wrapper, Button, Menu, MenuItem} from 'react-aria-menubutton'
import InfiniteScroll from 'react-infinite-scroller'
import {connect} from 'react-redux'
import {readEndpoint, safeGet} from 'jsonapi-client-redux'
import UserSummary from './UserSummary'
import {setUsersSort} from '../appreducer'

import './AriaMenuButton.css'

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
        title: 'Most stars',
        value: '-stars'
      }, {
        title: 'Fewest stars',
        value: 'stars'
      }, {
        title: 'Most recently joined',
        value: '-joinDate'
      }, {
        title: 'Least recently joined',
        value: 'joinDate'
      }, {
        title: 'Most tables',
        value: '-tablesCount'
      }, {
        title: 'Fewest tables',
        value: 'tablesCount'
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
          <Wrapper className="AriaMenuButton" onSelection={this.handleSelection}>
            <Button className="AriaMenuButton-trigger">
              Sort: {curSortTitle}
            </Button>
            <Menu>
              <ul className="AriaMenuButton-menu">
                {
                  menuItems.map((item, i) => {
                    let itemClass = 'AriaMenuButton-menuItem';
                    if (sort === item.value) {
                      itemClass += ' is-selected';
                    }
                    return (
                      <li className='AriaMenuButton-menuItemWrapper' key={i}>
                        <MenuItem className={itemClass} value={item.value}>{item.title}</MenuItem>
                      </li>
                    )
                  })
                }
              </ul>
            </Menu>
          </Wrapper>
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
            loader={<div className = "loader" > Loading ...</div>}
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
