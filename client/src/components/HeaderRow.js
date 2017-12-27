import React, {Component} from 'react'
import Cell from './Cell'

class HeaderRow extends Component<{
  fields: Array<Object>,
  valueAtPathChanged: (path: string, newValue: string) => void,
}> {
  render() {
    const {fields, valueAtPathChanged} = this.props
    if (fields) {
      const cellStyle = {
        backgroundColor: 'gainsboro',
        border: '1px solid darkgray',
        display: 'table-cell',
        padding: '3px 10px',
        width: '150px',
      }
      const stickyCellStyles = [
        {
          ...cellStyle,
          position: 'sticky',
          left: '1px',
        }, {
          ...cellStyle,
          position: 'sticky',
          left: '173px',
        }
      ]
      const numStickyCells = stickyCellStyles.length
      return (
        <div style={{
            border: '1px solid darkgray',
            display: 'table',
            position: 'sticky',
            tableLayout: 'fixed',
            top: '0px',
            width: '100%',
            zIndex: 100,
          }}>
          <div style={{
            backgroundColor: 'gainsboro',
            display: 'table-header-group',
            fontWeight: 'bold',
          }}>
            <div style={{
              display: 'table-row',
            }}>
              {fields.map((field, index) => (
                <div key={index} style={index < numStickyCells ? stickyCellStyles[index] : cellStyle}
                  data-rh={field.description}>
                  <Cell value={field.title} valueChanged={(newValue) => valueAtPathChanged(`/attributes/fields/${index}/title`, newValue)}/>
                </div>))
              }
            </div>
             <div style={{
              display: 'table-row',
            }}>
              {fields.map((field, index) => (
                <div key={index} style={index < numStickyCells ? stickyCellStyles[index] : cellStyle}
                  data-rh={field.description}>
                  {field.type}
                </div>))
              }
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

export default HeaderRow
