import React, {Component} from 'react'
import Cell from './Cell'

class Row extends Component<{
  row: Array<string>,
  rowNum: number,
  valueAtPathChanged: (path: string, newValue: string) => void,
}> {
  render() {
    const {row, rowNum, valueAtPathChanged} = this.props
    const cellStyle = {
      border: '1px solid darkgray',
      display: 'table-cell',
      padding: '3px 10px',
      width: '150px',
    }
    const stickyCellStyles = [
      {
        ...cellStyle,
        backgroundColor: 'gainsboro',
        position: 'sticky',
        left: '0px',
      }, {
        ...cellStyle,
        backgroundColor: 'gainsboro',
        position: 'sticky',
        left: '172px',
      }
    ]
    const numStickyCells = stickyCellStyles.length
    return (
      <div style={{
        display: 'table-row',
      }}>
        {row.map((value, index) => (
          <div key={index} style={index < numStickyCells ? stickyCellStyles[index] : cellStyle}>
            <Cell value={value} valueChanged={(newValue) => valueAtPathChanged(`/attributes/rows/${rowNum}/${index}`, newValue)}/>
          </div>))
        }
      </div>
    )
  }
}

export default Row
