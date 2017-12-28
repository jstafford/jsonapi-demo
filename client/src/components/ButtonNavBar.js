import React, {Component} from 'react'
import {Link, Route} from 'react-router-dom'

class ButtonNavBar extends Component<{
  navItems: Array<Object>,
}> {
  render() {
    const {navItems} = this.props
    const sharedStyle = {
      backgroundColor: '#EEE',
      backgroundImage: 'linear-gradient(#FCFCFC, #EEE)',
      border: '1px solid',
      borderColor: '#D5D5D5',
      display: 'inline-block',
      fontWeight: 'bold',
      padding: '6px 10px',
      textDecoration: 'none',
      userSelect: 'none',
    }
    const firstStyle = {
      ...sharedStyle,
      borderBottomLeftRadius: '3px',
      borderRight: 'none',
      borderTopLeftRadius: '3px',
    }
    const middleStyle = {
      ...sharedStyle,
      borderRight: 'none',
    }
    const lastStyle = {
      ...sharedStyle,
      borderTopRightRadius: '3px',
      borderBottomRightRadius: '3px',
    }
    const activeStyle = {
      backgroundColor:' #DCDCDC',
      backgroundImage: 'none',
      borderColor: '#B5B5B5'
    }
    const lastIndex = navItems.length - 1

    return (
      <div style={{
          margin: '10px'
        }}>
        {navItems.map((navItem, index) => (
          <Route key={index} path={navItem.to} children={({ match }) => {
            let style
            if (index === 0) {
              style = firstStyle
            } else if (index < lastIndex) {
              style = middleStyle
            } else {
              style = lastStyle
            }
            if (match) {
              style = {
                ...style,
                ...activeStyle
              }
            }
            return (
            <Link to={navItem.to} style={style}>{navItem.label}</Link>
          )}}/>
        ))}
      </div>
    )
  }
}

export default ButtonNavBar
