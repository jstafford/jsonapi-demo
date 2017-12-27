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
      const width = `${fields.length * 150}px`
      return (
        <div style={{
            overflow: 'hidden'
          }}>
          <header>
            <Link to={`/user/${owner.id}`}>{owner.attributes.name}</Link>
            <br/>
            <Cell value={data.attributes.title} valueChanged={newValue=>this.attributeChanged(newValue, 'title')}
              style={{
                fontSize: 'x-large',
                fontWeight: 'bold',
              }}/>
            <br/>
            <Cell value={data.attributes.description} valueChanged={newValue=>this.attributeChanged(newValue, 'description')}/>
          </header>
          <div style={{
            bottom: '100px',
            fontSize: 'small',
            overflowX: 'scroll',
            overflowY: 'scroll',
            position: 'absolute',
            textAlign: 'left',
            top: '75px',
            verticalAlign: 'middle',
            width: '100%',
          }}>
            <div style={{
                border: '1px solid darkgray',
                display: 'table',
                position: 'sticky',
                tableLayout: 'fixed',
                top: '0px',
                width: '100%',
                zIndex: 100,
              }}>
              <HeaderRow fields={fields} valueAtPathChanged={this.valueAtPathChanged}/>
            </div>
            <div style={{
                border: '1px solid darkgray',
                display: 'table',
                tableLayout: 'fixed',
                width: '100%',
              }}>
              <div style={{
                display: 'table-row-group',
                width: width,
              }}>
                {rows && rows.map((row, index) => (<Row key={index} rowNum={index} row={row} valueAtPathChanged={this.valueAtPathChanged}/>))}
              </div>
            </div>
          </div>
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
