import React, {Component} from 'react'
import TableRow from './TableRow'
import TableWrapper from './TableWrapper'

class TableHeader extends Component<{
  fields: Array<Object>,
  valueAtPathChanged: (path: string, newValue: string) => void,
}> {

  valueAtColumnChanged = (colNum, newValue) => {
    const {valueAtPathChanged} = this.props
    valueAtPathChanged(`/attributes/fields/${colNum}/title`, newValue)
  }

  render() {
    const {fields} = this.props
    if (fields) {
      const headers = []
      const types = []
      const tips = []
      fields.forEach(field => {
        headers.push(field.title)
        types.push(field.type)
        tips.push(field.description)
      })
      return (
        <TableWrapper style={{
            backgroundColor: 'gainsboro',
            fontWeight: 'bold',
            position: 'sticky',
            top: '0px',
            zIndex: 100,
          }}>
          <div style={{
            display: 'table-header-group',
          }}>
            <TableRow row={headers} tips={tips} valueAtColumnChanged={this.valueAtColumnChanged}/>
            <TableRow row={types} tips={tips}/>
          </div>
        </TableWrapper>
      )
    } else {
      return null
    }
  }
}

export default TableHeader
