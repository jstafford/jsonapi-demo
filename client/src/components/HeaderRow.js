import React, {Component} from 'react'
import Cell from './Cell'

class HeaderRow extends Component<{
  columns: Array<Object>,
  valueAtPathChanged: (path: string, newValue: string) => void,
}> {
  render() {
    const {columns, valueAtPathChanged} = this.props
    return (
      <tr style={{backgroundColor: 'gainsboro'}}>
        {columns.map((column, index) => (
          <th key={index} style={{
              border:'1px solid black',
              padding:'0.2em 0.4em'
            }}>
            <Cell value={column.title} valueChanged={(newValue) => valueAtPathChanged(`/attributes/columns/${index}/title`, newValue)}/>
          </th>))
        }
      </tr>
    )
  }
}

export default HeaderRow
