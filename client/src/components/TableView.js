import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {readEndpoint, updateResource} from 'redux-json-api'
import table from '../table'
import user from '../user'
import {generatePatch} from '../resourceIndexMiddleware'
import Cell from './Cell'
import HeaderRow from './HeaderRow'
import Row from './Row'

class TableViewRender extends Component<{
  data: table,
  owner: user,
  tableid: String,
  ensureTable: (id:string) => void,
  resourceChanged: (path: string, newValue: string) => void,
}> {
  componentWillMount () {
    const {ensureTable, tableid} = this.props
    if (tableid) {
      ensureTable(tableid)
    }
  }

  titleChanged = (newValue) => {
    const {data, resourceChanged} = this.props
    resourceChanged(data, '/attributes/title', newValue)
  }

  valueAtPathChanged = (path, newValue) => {
    const {data, resourceChanged} = this.props
    resourceChanged(data, path, newValue)
  }

  render() {
    const {data, owner} = this.props
    if (data) {
      const fields = data.attributes.fields
      const rows = data.attributes.rows
      return (
        <div>
          <Link to={`/user/${owner.id}`}>{owner.attributes.username}</Link>
          <table
            style={{
              borderCollapse: 'collapse',
              margin:'auto',
            }}>
            <caption
              style={{
                fontSize: 'x-large',
                fontWeight: 'bold',
                padding: '0.2em 0.4em',
              }}>
              <Cell value={data.attributes.title} valueChanged={this.titleChanged}/>
            </caption>
            <tbody
              style={{
                textAlign: 'center',
                verticalAlign: 'middle',
              }}>
              {fields && <HeaderRow fields={fields} valueAtPathChanged={this.valueAtPathChanged}/>}
              {rows && rows.map((row, index) => (<Row key={index} rowNum={index} row={row} valueAtPathChanged={this.valueAtPathChanged}/>))}
            </tbody>
          </table>
        </div>
      )
    } else {
      return null
    }
  }
}

const mapState = (state: GenericMap, ownProps: Object): Object => {
  const tableid = ownProps.match.params.tableid
  const index = tableid && state.resourceIndex.tables ? state.resourceIndex.tables[tableid] : undefined
  const data = index !== undefined ? state.api.tables.data[index] : null
  const ownerId = data ? data.relationships.owner.data.id : undefined
  const ownerIndex = ownerId && state.resourceIndex.users ? state.resourceIndex.users[ownerId] : undefined
  const owner = ownerIndex !== undefined ? state.api.users.data[ownerIndex] : null
  return {
    tableid,
    data,
    owner
  }
}

const mapDisp = (dispatch: Dispatch<Action>, ownProps: Object): Object => (
  {
    ensureTable: (id: string): void => {
      dispatch(readEndpoint(`tables/${id}?include=owner`))
    },
    resourceChanged: (data: table, path: string, newValue: string): void => {
      // console.log(`path: ${path}, value: ${newValue}`)
      const patch = generatePatch(data, path, newValue)
      console.log(JSON.stringify(patch))
      dispatch(updateResource(patch))
    }
  }
)

const TableView = connect(mapState, mapDisp)(TableViewRender)
export default TableView
