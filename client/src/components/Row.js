import React, {Component} from 'react'
import {connect} from 'react-redux'
import {updateResource} from 'redux-json-api'
import {ensureResource, generatePatch} from '../resourceIndexMiddleware'
import Cell from './Cell'

class RowRender extends Component<{
  rowid: string,
  data: Object,
  ensureRow: (id:string) => void,
  resourceChanged: (data:Object, path: string, newValue: string) => void,
}> {

  componentWillMount () {
    const {ensureRow, rowid} = this.props
    if (rowid) {
      ensureRow(rowid)
    }
  }

  valueAtIndexChanged = (index, newValue) => {
    const {data, resourceChanged} = this.props
    const path = `/attributes/values/${index}`
    resourceChanged(data, path, newValue)
  }

  render() {
    const {data} = this.props
    if (data) {
      const values = data.attributes.values
      return (
        <tr>
          {values.map((value, index) => (
            <td key={index} style={{
              border:'1px solid black',
              padding:'0.2em 0.4em'
            }}>
              <Cell value={value} valueChanged={(newValue) => this.valueAtIndexChanged(index, newValue)}/>
            </td>))
          }
        </tr>
      )
    } else {
      return null
    }
  }
}

const mapState = (state: GenericMap, ownProps: Object): Object => {
  const rowid = ownProps.rowid
  const index = rowid && state.resourceIndex.rows ? state.resourceIndex.rows[rowid] : undefined
  const data = index !== undefined ? state.api.rows.data[index] : null
  return {
    data,
  }
}

const mapDisp = (dispatch: Dispatch<Action>, ownProps: Object): Object => (
  {
    ensureRow: (id: string): void => {
      dispatch(ensureResource({type:'rows', id}))
    },
    resourceChanged: (data, path: string, newValue: string): void => {
      // console.log(`path: ${path}, value: ${newValue}`)
      const patch = generatePatch(data, path, newValue)
      console.log(JSON.stringify(patch))
      dispatch(updateResource(patch))
    }
  }
)

const Row = connect(mapState, mapDisp)(RowRender)
export default Row
