import React, {Component} from 'react'
import {Wrapper, Button, Menu, MenuItem} from 'react-aria-menubutton';
import {connect} from 'react-redux'
import {readEndpoint} from 'redux-json-api'
import UserSummary from './UserSummary'
import user from '../user'

import './AriaMenuButton.css'

class UsersRender extends Component < {
  users: Array<user>,
  getUsers: () => void,
  sortUsers: (value, e) => void,
} > {
  constructor(props) {
    super(props)
    this.state = {
      sort: ''
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

  render() {
    const {users} = this.props
    const {sort} = this.state;
    const menuItems = [
      {title: 'Default', value: ''},
      {title: 'Most stars', value: '-stars'},
      {title: 'Fewest stars', value: 'stars'},
      {title: 'Most recently joined', value: '-joinDate'},
      {title: 'Least recently joined', value: 'joinDate'},
      {title: 'Most tables', value: '-tablesCount'},
      {title: 'Fewest tables', value: 'tablesCount'},
    ]
    const curSortTitle = menuItems.filter(item => (item.value === sort))[0].title
    return (<div>
      <header>
        <span style={{
            fontSize: 'large',
            fontWeight: 'bold',
          }}>Users </span>
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
                  return (<li className='AriaMenuButton-menuItemWrapper' key={i}>
                    <MenuItem className={itemClass} value={item.value}>{item.title}</MenuItem>
                  </li>)
                })
              }
            </ul>
          </Menu>
        </Wrapper>
      </header>
      <ul>
        {users && users.map(user => (<UserSummary key={user.id} userid={user.id}/>))}
      </ul>
    </div>);
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
  sortUsers: (value, event) => {
    dispatch(readEndpoint(`users?sort=${value}`))
  }
})

const Users = connect(mapStateToProps, mapDispatchToProps)(UsersRender)

export default Users
