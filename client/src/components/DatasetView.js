import React, {Component} from 'react'
import {connect} from 'react-redux'
import {readEndpoint, updateResource} from 'redux-json-api'
import dataset from '../dataset'
import {generatePatch} from '../resourceIndexMiddleware'
import Cell from './Cell'
import HeaderRow from './HeaderRow'
import Row from './Row'

class DatasetViewRender extends Component<{
  data: dataset,
  datasetid: String,
  ensureDataset: (id:string) => void,
  resourceChanged: (path: string, newValue: string) => void,
}> {
  componentWillMount () {
    const {ensureDataset, datasetid} = this.props
    if (datasetid) {
      ensureDataset(datasetid)
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
    const {data} = this.props
    if (data) {
      const columns = data.attributes.columns
      const rows = data.relationships.rows.data
      return (
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
            {columns && <HeaderRow columns={columns} valueAtPathChanged={this.valueAtPathChanged}/>}
            {rows && rows.map((row, index) => (<Row key={row.id} rowid={row.id}/>))}
          </tbody>
        </table>
      )
    } else {
      return null
    }
  }
}

const mapState = (state: GenericMap, ownProps: Object): Object => {
  const datasetid = ownProps.match.params.datasetid
  const index = datasetid && state.resourceIndex.datasets ? state.resourceIndex.datasets[datasetid] : undefined
  const data = index !== undefined ? state.api.datasets.data[index] : null
  return {
    datasetid,
    data
  }
}

const mapDisp = (dispatch: Dispatch<Action>, ownProps: Object): Object => (
  {
    ensureDataset: (id: string): void => {
      dispatch(readEndpoint(`datasets/${id}?include=rows`))
    },
    resourceChanged: (data: dataset, path: string, newValue: string): void => {
      // console.log(`path: ${path}, value: ${newValue}`)
      const patch = generatePatch(data, path, newValue)
      console.log(JSON.stringify(patch))
      dispatch(updateResource(patch))
    }
  }
)

const DatasetView = connect(mapState, mapDisp)(DatasetViewRender)
export default DatasetView
