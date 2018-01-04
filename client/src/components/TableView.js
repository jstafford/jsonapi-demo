import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {readEndpoint, safeGet, updateResource} from 'jsonapi-client-redux'
import table from '../table'
import user from '../user'
import {generatePatch} from '../generatePatch'
import Cell from './Cell'
import TableHeader from './TableHeader'
import TableBody from './TableBody'
import TableFooter from './TableFooter'
import TagBar from './TagBar'

class TableViewRender extends Component<{
  owner: user,
  table: table,
  tableid: string,
  tableinfo: Object,
  tableinfoid: string,
  ensureTableinfo: (id: string) => void,
  resourceChanged: (data: Object, path: string, newValue: string) => void,
}> {
  componentWillMount () {
    const {ensureTableinfo, tableinfoid} = this.props
    if (tableinfoid) {
      ensureTableinfo(tableinfoid)
    }
  }

  infoAttributeChanged = (newValue, attribute) => {
    const {tableinfo, resourceChanged} = this.props
    resourceChanged(tableinfo, `/attributes/${attribute}`, newValue)
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
    const {owner, table, tableinfo, resourceChanged} = this.props

    if (owner && table && tableinfo) {
      return (
        <div>
          <header>
            <Link to={`/user/${owner.id}`}>{owner.attributes.name}</Link>
            <br/>
            <Cell value={tableinfo.attributes.title} valueChanged={newValue=>this.infoAttributeChanged(newValue, 'title')}
              style={{
                fontSize: 'x-large',
                fontWeight: 'bold',
              }}/>
            <br/>
            <Cell value={tableinfo.attributes.description} valueChanged={newValue=>this.infoAttributeChanged(newValue, 'description')}/>
            <br/>
            <span style={{
              fontSize: 'small',
            }}>★: {tableinfo.attributes.starsCount} <em>Columns:</em> {tableinfo.attributes.columnsCount} <em>Rows:</em> {tableinfo.attributes.rowsCount} <em>Created:</em> {tableinfo.attributes.createdDate} <em>Updated:</em> {tableinfo.attributes.updatedDate}
            </span>
            <br/>
            <span style={{
              fontWeight: 'bold',
            }}>Tags: </span><TagBar tags={tableinfo.relationships.tags.data}/>
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
                top: '110px',
                width: '100%',
              }}
            >
              <TableHeader table={table} tableinfo={tableinfo} resourceChanged={resourceChanged}/>
              <TableBody table={table} resourceChanged={resourceChanged}/>
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
                <TableFooter table={table}/>
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
  const tableinfoid = ownProps.match.params.tableid
  const tableinfo = safeGet(state, ['api', 'resources', 'tableinfos', tableinfoid], null)
  const ownerid = tableinfo ? tableinfo.relationships.owner.data.id : undefined
  const tableid = tableinfo ? tableinfo.relationships.table.data.id : undefined
  const owner = safeGet(state, ['api', 'resources', 'users', ownerid], null)
  const table = safeGet(state, ['api', 'resources', 'tables', tableid], null)
  return {
    owner,
    table,
    tableid,
    tableinfo,
    tableinfoid,
  }
}

const mapDisp = (dispatch: Dispatch<Action>, ownProps: Object): Object => (
  {
    ensureTableinfo: (id: string): void => {
      dispatch(readEndpoint(`tableinfos/${id}?include=owner,table`))
    },
    resourceChanged: (data: Object, path: string, newValue: string): void => {
      // console.log(`path: ${path}, value: ${newValue}`)
      const patch = generatePatch(data, path, newValue)
      console.log(JSON.stringify(patch))
      dispatch(updateResource(patch))
    }
  }
)

const TableView = connect(mapState, mapDisp)(TableViewRender)
export default TableView
