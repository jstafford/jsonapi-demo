import React, {Component} from 'react'
import {Wrapper, Button, Menu, MenuItem} from 'react-aria-menubutton';
import InfiniteScroll from 'react-infinite-scroller'
import {connect} from 'react-redux'
import {readEndpoint} from 'redux-json-api'
import UserSummary from './UserSummary'
import user from '../user'

import './AriaMenuButton.css'

class UsersRender extends Component < {
  users: Array<user>,
  getUsers: () => void,
  sortUsers: (value, e) => void,
  loadMoreUsers: (sort, limit, offset) => void
} > {
  constructor(props) {
    super(props)
    this.state = {
      sort: '',
      limit: 50
    }
  }

  componentWillMount() {
    const {getUsers} = this.props
    getUsers()
  }

  handleSelection = (value, e) => {
    const {sortUsers} = this.props
      this.setState({sort: value})
    sortUsers(value, e)
  }

  loadMore = (page) => {
    const {loadMoreUsers, users} = this.props
    const {sort, limit} = this.state
    if (users) {
      const offset = users.length
      loadMoreUsers(sort, limit, offset)
    }
  }

  render() {
    const {users} = this.props
    const {sort} = this.state;
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
      }
    ]
    const curSortTitle = menuItems
      .filter(item => (item.value === sort))[0]
      .title
    // style={{     bottom: '0px',     left: '0px',     margin: '0px',
    // overflow: 'auto',     position: 'absolute',     right: '0px',
    // top: '50px',   }}
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
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadMore}
          hasMore={true}
          loader={<div className = "loader" > Loading ...</div>}>
          <ul >
            {
              users && users.map(
                user => (<UserSummary key={user.id} userid={user.id}/>)
              )
            }
          </ul>
        </InfiniteScroll>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const users = state.api.users
    ? state.api.users.data
    : null
  return {users}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  getUsers: () => {
    dispatch(readEndpoint('users?include=tables'))
  },
  loadMoreUsers: (sort, limit, offset) => {
    dispatch(
      readEndpoint(`users?sort=${sort}&page[limit]=${limit}&page[offset]=${offset}`)
    )
  },
  sortUsers: (value, event) => {
    dispatch(readEndpoint(`users?sort=${value}`))
  }
})

const Users = connect(mapStateToProps, mapDispatchToProps)(UsersRender)

export default Users
