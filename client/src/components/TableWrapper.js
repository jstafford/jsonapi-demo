import React, {Component} from 'react'

class TableWrapper extends Component<{
  style: Object
}> {
  render() {
    const {children, style} = this.props
    const defaultStyle = {
      border: '1px solid darkgray',
      display: 'table',
      tableLayout: 'fixed',
      width: '100%',
    }
    return (
      <div style={{...defaultStyle, ...style}}>
        {children}
      </div>
    )
  }
}

export default TableWrapper
