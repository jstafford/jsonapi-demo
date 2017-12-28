import React, {Component} from 'react'
import Row from './Row'
import TableWrapper from './TableWrapper'

class TableBody extends Component<{
  rows: Array<Object>,
  valueAtPathChanged: (path, newValue) => void
}> {

  render() {
    const {rows, valueAtPathChanged} = this.props
    if (rows) {
      return (
        <TableWrapper>
          <div style={{
            display: 'table-row-group',
          }}>
            {rows && rows.map((row, index) => (<Row key={index} rowNum={index} row={row} valueAtPathChanged={valueAtPathChanged}/>))}
          </div>
        </TableWrapper>
      )
    } else {
      return null
    }
  }
}

export default TableBody
