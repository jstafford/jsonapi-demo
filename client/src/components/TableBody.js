import React, {Component} from 'react'
import table from '../table'
import TableRow from './TableRow'
import TableWrapper from './TableWrapper'

class TableBody extends Component<{
  table: table,
  resourceChanged: (data: Object, path: string, newValue: string) => void,
}> {

  render() {
    const {table, resourceChanged} = this.props
    if (table) {
      const rows = table.attributes.rows
      return (
        <TableWrapper>
          <div style={{
            display: 'table-row-group',
          }}>
            {rows && rows.map((row, rowNum) => (<TableRow key={rowNum} row={row} valueAtColumnChanged={(colNum, newValue) => resourceChanged(table, `/attributes/rows/${rowNum}/${colNum}`, newValue)}/>))}
          </div>
        </TableWrapper>
      )
    } else {
      return null
    }
  }
}

export default TableBody
