import React, {Component} from 'react'
import Cell from './Cell'

class Row extends Component<{
  row: Array<string>,
  rowNum: number,
  valueAtPathChanged: (path: string, newValue: string) => void,
}> {
  render() {
    const {row, rowNum, valueAtPathChanged} = this.props
    return (
      <div style={{
        display: 'table-row',
      }}>
        {row.map((value, index) => (
          <div key={index} style={{
            border: '1px solid darkgray',
            display: 'table-cell',
            padding: '3px 10px',
            width: '150px',
          }}>
            <Cell value={value} valueChanged={(newValue) => valueAtPathChanged(`/attributes/rows/${rowNum}/${index}`, newValue)}/>
          </div>))
        }
      </div>
    )
  }
}

export default Row
