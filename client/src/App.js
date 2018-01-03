import React, { Component } from 'react'
import ReactHintFactory from 'react-hint'
import {
  BrowserRouter as Router,
  Route,
  Switch,
}                         from 'react-router-dom'
import Home from './components/Home'
import TableView from './components/TableView'
import UserView from './components/UserView'

import '../node_modules/react-hint/css/index.css'

const ReactHint = ReactHintFactory(React)

class App extends Component {
  render() {
    return (
      <Router>
        <div style={{
            height: '100%',
            overflow: 'hidden',
            width: '100%',
          }}>
          <ReactHint events delay={100} position='bottom' />
          <Switch>
            <Route path="/user/:userid" component={UserView} />
            <Route path="/table/:tableid" component={TableView} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
