import React, {Component} from 'react'
import table from '../table'
import TableRow from './TableRow'
import TableWrapper from './TableWrapper'

class TableFooter extends Component<{
  data: table,
}> {
  numberFormater = new Intl.NumberFormat()

  convertStatColsToDisplayRows(data) {
    const numRowsReducer = (accumulator, statCol) => (Math.max(accumulator, statCol.length))
    const fields = data.attributes.fields
    const stats = data.attributes.stats
    const numRows = stats.reduce(numRowsReducer, 0)
    const numCols = stats.length
    const statRows = []
    const numberTypes = new Set(['number','integer','boolean',])

    for(let row = 0; row<numRows; row++) {
      const statRow = []
      for (let col=0; col<numCols; col++) {
        if (row < stats[col].length) {
          const stat = stats[col][row]
          const colType = fields[col].type
          let displayValue = stat.value
          if (numberTypes.has(colType)) {
            displayValue = this.numberFormater.format(displayValue)
          }
          statRow.push((<span><em>{stat.name}:</em> {displayValue}</span>))
        } else {
          statRow.push(null)
        }
      }
      statRows.push(statRow)
    }

    return statRows
  }

  render() {
    const {data} = this.props
    if (data) {
      const statRows = this.convertStatColsToDisplayRows(data)
      return (
        <TableWrapper style={{
            backgroundColor: 'whitesmoke',
          }}>
          <div style={{
            display: 'table-footer-group',
          }}>
            {statRows && statRows.map((statRow, index) => (<TableRow key={index} row={statRow}/>))}
          </div>
        </TableWrapper>
      )
    } else {
      return null
    }
  }
}

export default TableFooter
