import React, {Component} from 'react'
import Cell from './Cell'

class TableRow extends Component<{
  row: Array<string>,
  rowNum: number,
  rowType: string,
  tablesFocus: string,
  tips: Array<string>,
  valueAtColumnChanged: (colNum, newValue: string) => void,
}> {
  valueChanged = (newValue, e) => {
    const {valueAtColumnChanged} = this.props
    const colNum = e.target.name
    valueAtColumnChanged(colNum, newValue)
  }

  render() {
    const {row, rowNum, rowType, tablesFocus, tips, valueAtColumnChanged} = this.props
    const cellStyle = {
      border: '1px solid darkgray',
      display: 'table-cell',
      overflow: 'hidden',
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
          <div key={index} style={index < numStickyCells ? stickyCellStyles[index] : cellStyle} data-rh={tips ? tips[index] : undefined}>
            <Cell value={value} rowType={rowType} rowNum={rowNum} colNum={index} tablesFocus={tablesFocus} valueChanged={valueAtColumnChanged ? this.valueChanged : null}/>
          </div>))
        }
      </div>
    )
  }
}

export default TableRow
