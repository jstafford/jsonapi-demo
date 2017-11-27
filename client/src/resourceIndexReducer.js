import {createAction} from 'redux-actions'


const INDEX_REFRESH = 'INDEX_REFRESH'

export const indexRefresh = createAction(INDEX_REFRESH)

const refreshIndexHandler = (state, action) => {
  const api = action.payload
  // extract just the non default parts of the api store
  const {isCreating, isReading, isUpdating, isDeleting, endpoint, ...resources} = api
  const newState = {}
  Object.keys(resources).forEach(resourceType => {
    const resourceIdToIndex = {}
    const resourceArray = api[resourceType].data
    if (resourceArray) {
      resourceArray.forEach((resource, index) => {
        resourceIdToIndex[resource.id] = index
      })
    }
    newState[resourceType] = resourceIdToIndex
  })
  return newState
}

const resourceIndexReducer = (state = {}, action) => {
  switch (action.type) {
    case INDEX_REFRESH:
      return refreshIndexHandler(state, action)
    default:
      return state
  }
}

export default resourceIndexReducer
