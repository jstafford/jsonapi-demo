import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import dataset from '../dataset'

class DatasetRender extends Component<{
  datasetid: string,
  data: dataset,
}> {
  render() {
    const {data} = this.props
    if (data) {
      return (
        <li><Link to={`/dataset/${data.id}`}>{data.attributes.title}</Link></li>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const index = state.resourceIndex.datasets ? state.resourceIndex.datasets[ownProps.datasetid] : undefined
  const data = index !== undefined ? state.api.datasets.data[index] : null
  return {
    data
  }
}

const Dataset = connect(mapStateToProps, null)(DatasetRender)

export default Dataset
