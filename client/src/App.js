import React, { Component } from 'react'
import ReactHintFactory from 'react-hint'
import {
  BrowserRouter as Router,
  Route,
  Switch,
}                         from 'react-router-dom'
import TableView from './components/TableView'
import UserView from './components/UserView'
import Users from './components/Users'

import '../node_modules/react-hint/css/index.css'

const ReactHint = ReactHintFactory(React)

class App extends Component {
  render() {
    return (
      <Router>
        <div style={{
            bottom: '0px',
            left: '0px',
            overflow: 'hidden',
            position: 'absolute',
            right: '0px',
            top: '0px',
          }}>
          <ReactHint events delay={100} position='bottom' />
          <Switch>
            <Route exact path="/" component={Users} />
            <Route path="/user/:userid" component={UserView} />
            <Route path="/table/:tableid" component={TableView} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
