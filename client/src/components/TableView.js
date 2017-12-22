import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {readEndpoint, safeGet, updateResource} from 'jsonapi-client-redux'
import table from '../table'
import user from '../user'
import {generatePatch} from '../generatePatch'
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

  attributeChanged = (newValue, attribute) => {
    const {data, resourceChanged} = this.props
    resourceChanged(data, `/attributes/${attribute}`, newValue)
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
          <Link to={`/user/${owner.id}`}>{owner.attributes.name}</Link>
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
              <Cell value={data.attributes.title} valueChanged={newValue=>this.attributeChanged(newValue, 'title')}/>
            </caption>
            <caption
              style={{
                padding: '0.2em 0.4em',
              }}>
              <Cell value={data.attributes.description} valueChanged={newValue=>this.attributeChanged(newValue, 'description')}/>
            </caption>
            {fields && <HeaderRow fields={fields} valueAtPathChanged={this.valueAtPathChanged}/>}
            <tbody
              style={{
                textAlign: 'left',
                verticalAlign: 'middle',
              }}>
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
  const data = safeGet(state, ['api', 'resources', 'tables', tableid], null)
  const ownerId = data ? data.relationships.owner.data.id : undefined
  const owner = safeGet(state, ['api', 'resources', 'users', ownerId], null)
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
