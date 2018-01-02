import React, {Component} from 'react'

class SearchBar extends Component<{
}> {

  render() {
    return (
      <div style={{
        display: 'inline-block',
        flex: 1,
        width: '100%',
      }}>
        <input style={{
          width: '100%',
        }}/>
      </div>
    )
  }
}

export default SearchBar
