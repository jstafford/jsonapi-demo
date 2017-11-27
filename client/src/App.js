import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
}                         from 'react-router-dom'
import DatasetView from './components/DatasetView'
import UserView from './components/UserView'
import Users from './components/Users'

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Users} />
          <Route path="/user/:userid" component={UserView} />
          <Route path="/dataset/:datasetid" component={DatasetView} />
        </Switch>
      </Router>
    )
  }
}

export default App
