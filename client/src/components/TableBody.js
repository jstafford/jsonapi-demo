import React, {Component} from 'react'
import Row from './Row'

class TableBody extends Component<{
  rows: Array<Object>,
  valueAtPathChanged: (path, newValue) => void
}> {

  render() {
    const {rows, valueAtPathChanged} = this.props
    if (rows) {
      return (
        <div style={{
            border: '1px solid darkgray',
            display: 'table',
            tableLayout: 'fixed',
            width: '100%',
          }}>
          <div style={{
            display: 'table-row-group',
          }}>
            {rows && rows.map((row, index) => (<Row key={index} rowNum={index} row={row} valueAtPathChanged={valueAtPathChanged}/>))}
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

export default TableBody
