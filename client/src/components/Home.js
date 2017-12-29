import React, {Component} from 'react'
import {Switch, Route} from 'react-router-dom'
import ButtonNavBar from './ButtonNavBar'
import Tables from './Tables'
import Users from './Users'

class Home extends Component<{
}> {
  render() {
    const navItems = [
      {
        to:`/users`,
        label: 'Users',
      }, {
        to:`/tables`,
        label: 'Tables',
      }
    ]
    return (
      <div>
        <header>
          <span style={{
            fontSize: 'x-large',
            fontWeight: 'bold',
          }}>Welcome</span>
          <ButtonNavBar navItems={navItems}/>
        </header>
        <Switch>
          <Route path="/users" component={Users}/>
          <Route path="/tables" component={Tables}/>
        </Switch>
      </div>
    )
  }
}

export default Home
