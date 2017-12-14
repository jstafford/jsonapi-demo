import React, {Component} from 'react'
import Cell from './Cell'

class HeaderRow extends Component<{
  fields: Array<Object>,
  valueAtPathChanged: (path: string, newValue: string) => void,
}> {
  render() {
    const {fields, valueAtPathChanged} = this.props
    return (
      <thead style={{
        textAlign: 'left',
        verticalAlign: 'middle',
      }}>
        <tr style={{backgroundColor: 'gainsboro'}}>
          {fields.map((field, index) => (
            <th key={index} style={{
                border:'1px solid black',
                padding:'0.2em 0.4em'
              }}
              data-rh={field.description}>
              <Cell value={field.title} valueChanged={(newValue) => valueAtPathChanged(`/attributes/fields/${index}/title`, newValue)}/>
            </th>))
          }
        </tr>
        <tr style={{backgroundColor: 'gainsboro'}}>
          {fields.map((field, index) => (
            <th key={index} style={{
                border:'1px solid black',
                padding:'0.2em 0.4em'
              }}
              data-rh={field.description}>
              {field.type}
            </th>))
          }
        </tr>
      </thead>
    )
  }
}

export default HeaderRow
