import React, {Component} from 'react'
import StatRow from './StatRow'
import TableWrapper from './TableWrapper'

class TableFooter extends Component<{
  stats: Array<Object>,
}> {
  convertStatColsToDisplayRows(stats) {
    const numRowsReducer = (accumulator, statCol) => (Math.max(accumulator, statCol.length))
    const numRows = stats.reduce(numRowsReducer, 0)
    const numCols = stats.length
    const statRows = []

    for(let row = 0; row<numRows; row++) {
      const statRow = []
      for (let col=0; col<numCols; col++) {
        if (row < stats[col].length) {
          const stat = stats[col][row]
          statRow.push(`${stat.name}: ${stat.value}`)
        } else {
          statRow.push('')
        }
      }
      statRows.push(statRow)
    }

    return statRows
  }

  render() {
    const {stats} = this.props
    if (stats) {
      const statRows = this.convertStatColsToDisplayRows(stats)
      return (
        <TableWrapper style={{zIndex: 100}}>
          <div style={{
            backgroundColor: 'gainsboro',
            display: 'table-footer-group',
          }}>
            {statRows && statRows.map((statRow, index) => (<StatRow key={index} statRow={statRow}/>))}
          </div>
        </TableWrapper>
      )
    } else {
      return null
    }
  }
}

export default TableFooter
