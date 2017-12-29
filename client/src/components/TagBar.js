import React, {Component} from 'react'

class TagBar extends Component<{
  tags: Array<string>,
}> {
  render() {
    const {tags} = this.props
    const defaultStyle = {
      backgroundColor: 'lavender',
      borderRadius: '6px',
      display: 'inline-block',
      fontSize: 'inherit',
      marginRight: '6px',
      padding: '4px 6px',
      userSelect: 'none',
    }

    return (
      <span>
        {tags.map((tag, index) => (
          <span key={index} style={defaultStyle}>{tag}</span>
        ))}
      </span>
    )
  }
}

export default TagBar
