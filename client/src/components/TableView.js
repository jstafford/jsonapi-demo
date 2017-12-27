import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {readEndpoint, safeGet, updateResource} from 'jsonapi-client-redux'
import table from '../table'
import user from '../user'
import {generatePatch} from '../generatePatch'
import Cell from './Cell'
import HeaderRow from './HeaderRow'
import TableBody from './TableBody'
import TableFooter from './TableFooter'

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

  mainDomEl = null
  footerDomEl = null

  isSyncingMainScroll = false
  onMainScroll = (e) => {
    if (!this.isSyncingMainScroll) {
      this.isSyncingMainScroll = true
      this.footerDomEl.scrollLeft = e.target.scrollLeft
    }
    this.isSyncingMainScroll = false
  }

  isSyncingFooterScroll = false
  onFooterScroll = (e) => {
    if (!this.isSyncingFooterScroll) {
      this.isSyncingFooterScroll = true
      this.mainDomEl.scrollLeft = e.target.scrollLeft
    }
    this.isSyncingFooterScroll = false
  }

  render() {
    const {data, owner} = this.props

    if (data) {
      const fields = data.attributes.fields
      const rows = data.attributes.rows
      const stats = data.attributes.stats
      return (
        <div>
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
              fontSize: 'small',
              textAlign: 'left',
              verticalAlign: 'middle',
            }}>
            <main
              ref={ (element) => { this.mainDomEl = element } }
              onScroll={this.onMainScroll}
              style={{
                bottom: '100px',
                overflow: 'scroll',
                position: 'absolute',
                top: '75px',
                width: '100%',
              }}
            >
              <HeaderRow fields={fields} valueAtPathChanged={this.valueAtPathChanged}/>
              <TableBody rows={rows} valueAtPathChanged={this.valueAtPathChanged}/>
            </main>
            <footer
              ref={ (element) => { this.footerDomEl = element } }
              onScroll={this.onFooterScroll}
              style={{
                bottom:'0px',
                height: '100px',
                overflow: 'scroll',
                position: 'absolute',
                width:'100%',
              }}>
                <TableFooter stats={stats}/>
            </footer>
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
