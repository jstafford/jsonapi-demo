import React, {Component} from 'react'
import {connect} from 'react-redux'
import dataset from '../dataset'
import {ensureResource} from '../resourceIndexMiddleware'

class DatasetViewRender extends Component<{
  data: dataset,
  datasetid: String,
  ensureDataset: (id:string) => void
}> {
  componentWillMount () {
    const {ensureDataset, datasetid} = this.props
    if (datasetid) {
      ensureDataset(datasetid)
    }
  }

  render() {
    const {data} = this.props
    if (data) {
      return (
        <p>{data.attributes.title}</p>
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
    ensureDataset: (id:string): void => {
      dispatch(ensureResource({type:'datasets', id}))
    }
  }
)

const DatasetView = connect(mapState, mapDisp)(DatasetViewRender)
export default DatasetView
