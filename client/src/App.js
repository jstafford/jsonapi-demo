import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
}                         from 'react-router-dom'
import TableView from './components/TableView'
import UserView from './components/UserView'
import Users from './components/Users'

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Users} />
          <Route path="/user/:userid" component={UserView} />
          <Route path="/table/:tableid" component={TableView} />
        </Switch>
      </Router>
    )
  }
}

export default App
