import React, {Component} from 'react'
import Cell from './Cell'

class HeaderRow extends Component<{
  fields: Array<Object>,
  valueAtPathChanged: (path: string, newValue: string) => void,
}> {
  render() {
    const {fields, valueAtPathChanged} = this.props
    const cellStyle = {
      backgroundColor: 'gainsboro',
      border: '1px solid darkgray',
      display: 'table-cell',
      padding: '3px 10px',
      width: '150px',
    }
    const firstCellStyle = {
      ...cellStyle,
      // position: 'sticky',
      // left: '0px',
    }
    if (fields) {
      return (
        <div style={{
          backgroundColor: 'gainsboro',
          display: 'table-header-group',
          fontWeight: 'bold',
        }}>
          <div style={{
            display: 'table-row',
          }}>
            {fields.map((field, index) => (
              <div key={index} style={index===0?firstCellStyle:cellStyle}
                data-rh={field.description}>
                <Cell value={field.title} valueChanged={(newValue) => valueAtPathChanged(`/attributes/fields/${index}/title`, newValue)}/>
              </div>))
            }
          </div>
           <div style={{
            display: 'table-row',
          }}>
            {fields.map((field, index) => (
              <div key={index} style={index===0?firstCellStyle:cellStyle}
                data-rh={field.description}>
                {field.type}
              </div>))
            }
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

export default HeaderRow
