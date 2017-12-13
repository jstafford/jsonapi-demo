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
      <tr>
        {row.map((value, index) => (
          <td key={index} style={{
            border:'1px solid black',
            padding:'0.2em 0.4em'
          }}>
            <Cell value={value} valueChanged={(newValue) => valueAtPathChanged(`/attributes/rows/${rowNum}/${index}`, newValue)}/>
          </td>))
        }
      </tr>
    )
  }
}

export default Row
