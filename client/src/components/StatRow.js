import React, {Component} from 'react'

class StatRow extends Component<{
  statRow: Array<string>,
}> {
  render() {
    const {statRow} = this.props
    if (statRow) {
      const cellStyle = {
        backgroundColor: 'whitesmoke',
        border: '1px solid darkgray',
        display: 'table-cell',
        overflow: 'hidden',
        padding: '3px 10px',
        whiteSpace: 'nowrap',
        width: '150px',
      }
      const stickyCellStyle = {
        ...cellStyle,
        backgroundColor: 'gainsboro',
        position: 'sticky',
      }
      const stickyCellStyles = [
        {
          ...stickyCellStyle,
          left: '1px',
        }, {
          ...stickyCellStyle,
          left: '173px',
        }
      ]
      const numStickyCells = stickyCellStyles.length
      return (
        <div style={{
          display: 'table-row',
        }}>
          {statRow.map((stat, index) => (
            <div key={index} style={index < numStickyCells ? stickyCellStyles[index] : cellStyle}>
              {stat}
            </div>))
          }
        </div>
      )
    } else {
      return null
    }
  }
}

export default StatRow
