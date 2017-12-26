import React, {Component} from 'react'
import './Progress.css'

class Progress extends Component<{
}> {
  render() {
    const frameDuration = 0.1
    const numItems = 7
    const animationDuration = numItems * 2 * frameDuration
    const itemStyles = []

    for (let i = 0; i < numItems; i++) {
      const itemStyle = {
        animation: `colorShift ${animationDuration}s linear infinite`,
        animationDelay: `${(i*frameDuration) - animationDuration}s`,
      }
      itemStyles.push(itemStyle)
    }

    return (
      <div>
        <span>Loading</span>
        {itemStyles.map((itemStyle, i) => (<span key={i} style={itemStyle}>.</span>))}
      </div>
    )
  }
}

export default Progress
