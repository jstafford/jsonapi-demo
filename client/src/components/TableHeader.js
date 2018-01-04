import React, {Component} from 'react'
import table from '../table'
import TableRow from './TableRow'
import TableWrapper from './TableWrapper'

class TableHeader extends Component<{
  table: table,
  tableinfo: Object,
  tablesFocus: string,
  resourceChanged: (data: Object, path: string, newValue: string) => void,
}> {

  valueAtColumnChanged = (colNum, newValue) => {
    const {tableinfo, resourceChanged} = this.props
    resourceChanged(tableinfo, `/attributes/fields/${colNum}/title`, newValue)
  }

  render() {
    const {table, tableinfo, tablesFocus} = this.props
    if (table &&  tableinfo) {
      const headers = []
      const types = []
      const tips = []
      tableinfo.attributes.fields.forEach(field => {
        headers.push(field.title)
        tips.push(field.description)
      })
      table.attributes.fields.forEach(field => {
        types.push(field.type)
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
            <TableRow row={headers} rowType='h' rowNum={0} tablesFocus={tablesFocus} tips={tips} valueAtColumnChanged={this.valueAtColumnChanged}/>
            <TableRow row={types} rowType='h' rowNum={1} tablesFocus={tablesFocus} tips={tips}/>
          </div>
        </TableWrapper>
      )
    } else {
      return null
    }
  }
}

export default TableHeader
