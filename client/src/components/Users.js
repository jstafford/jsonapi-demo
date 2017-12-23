import React, {Component} from 'react'
import {Wrapper, Button, Menu, MenuItem} from 'react-aria-menubutton'
import {connect} from 'react-redux'
import {readEndpoint, safeGet} from 'jsonapi-client-redux'
import UserSummary from './UserSummary'
import {setUsersSort} from '../appreducer'
// import user from '../user'

import './AriaMenuButton.css'

class UsersRender extends Component < {
  sort: string,
  sortIds: Array<string>,
  changeSort: (sort) => void,
  sortUsers: (value, e) => void,
  loadMoreUsers: (sort, limit, offset) => void
} > {
  componentWillMount() {
    const {loadMoreUsers, sort} = this.props
    loadMoreUsers(sort, 50, 0)
  }

  handleSelection = (value, e) => {
    const {sortUsers, changeSort, sort} = this.props
    if (value !== sort) {
      changeSort(value)
      sortUsers(value, e)
    }
  }

  loadMore = (page) => {
    const {loadMoreUsers, sort, users} = this.props
    if (users) {
      loadMoreUsers(sort, 50, 50)
    }
  }

  render() {
    const {sort, sortIds} = this.props
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
          <ul >
            {
              sortIds && sortIds.map(
                (id, index) => {
                  if (id) {
                    return (<UserSummary key={id} userid={id}/>)
                  } else {
                    return (<div key={index} style={{height: 36}}></div>)
                  }
                }
              )
            }
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const sort = state.app.sort
  const sortKey = `sort=${sort}`
  const sortIds = safeGet(state, ['api', 'sorts', 'users', sortKey], null)
  return {
    sort,
    sortIds
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeSort: (sort) => {
    dispatch(setUsersSort(sort))
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
