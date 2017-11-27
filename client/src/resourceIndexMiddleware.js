import {createAction} from 'redux-actions'
import {readEndpoint} from 'redux-json-api'
import {indexRefresh} from './resourceIndexReducer'

const INDEX_ENSURE_RESOURCE = 'INDEX_ENSURE_RESOURCE'

export const ensureResource = createAction(INDEX_ENSURE_RESOURCE)

const handleEnsureResource = (store, action) => {
  const {type, id, params} = action.payload
  const state = store.getState()
  const hasResource = state.resourceIndex && state.resourceIndex[type] && state.resourceIndex[type][id]
  if (!hasResource) {
    const url = params ? `${type}/${id}?${params}` : `${type}/${id}`
    store.dispatch(readEndpoint(url))
  }
}

const resourceIndexMiddleware = (store: Store<GenericMap, Action>)  =>
                        (next: (Action) => Action) =>
                        ( action: Action ): Action => {

  const nextAction = next(action)
  switch (action.type) {
    case 'API_HYDRATE':
    case 'API_CREATED':
    case 'API_READ':
    case 'API_UPDATED':
    case 'API_DELETED':
      const state = store.getState()
      store.dispatch(indexRefresh(state.api))
      break
    case INDEX_ENSURE_RESOURCE:
      handleEnsureResource(store, action)
      break
    default:
      break
  }

  return nextAction
}

export default resourceIndexMiddleware
