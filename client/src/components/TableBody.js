import React, {Component} from 'react'
import TableRow from './TableRow'
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
            {rows && rows.map((row, rowNum) => (<TableRow key={rowNum} row={row} valueAtColumnChanged={(colNum, newValue) => valueAtPathChanged(`/attributes/rows/${rowNum}/${colNum}`, newValue)}/>))}
          </div>
        </TableWrapper>
      )
    } else {
      return null
    }
  }
}

export default TableBody
