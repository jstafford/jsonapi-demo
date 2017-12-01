import invariant from 'invariant'
import {isArray, isObject, toNumber} from 'lodash'
import {createAction} from 'redux-actions'
import {readEndpoint} from 'redux-json-api'
import warning from 'warning'
import {indexRefresh} from './resourceIndexReducer'
import resource from './resource'

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

export const generatePatch = (original: resource, path: string, newValue: string): resource => {
  const patch = {
    id: original.id,
    type: original.type
  }

  const pathParts = path.split('/')
  const lastIndex = pathParts.length - 1
  let sourceObj = original
  let targetObj = patch
  pathParts.forEach((pathPart, index) => {
    if (index === 0) {
      // skip the first empty pathPart from the leading slash
      warning(pathPart.length === 0, 'got an invalid patch path (no leading slash)')
    } else if (index === lastIndex) {
      // set the value
      targetObj[pathPart] = newValue
    } else {
      // build up the object chain
      if (sourceObj.hasOwnProperty(pathPart)) {
        sourceObj = sourceObj[pathPart]
        if (isObject(sourceObj)) {
          // if (isArray(targetObj)) {
          //   const position = toNumber(pathPart)
          //   invariant(position < Number.MAX_SAFE_INTEGER, `partPart in Array is not a valid Number: ${pathPart}`)
          //   // fill array with undefined up to position
          //   let i = 0
          //   while (i<position) {
          //     targetObj[i] = undefined
          //   }
          //   if (isArray(sourceObj)) {
          //     targetObj[position] = []
          //   } else {
          //     targetObj[position] = {}
          //   }
          //   targetObj = targetObj[position]
          // } else {
            if (isArray(sourceObj)) {
              targetObj[pathPart] = []
            } else {
              targetObj[pathPart] = {}
            }
            targetObj = targetObj[pathPart]
          // }
        } else {
          warning(false, `generatePatch: found path part that is not an Object: ${sourceObj}`)
        }
      } else {
        warning(false, `generatePatch: could not find proprperty ${pathPart} as part of path ${path} in object ${JSON.stringify(sourceObj)}`)
      }
    }

  })
  return patch
}

export default resourceIndexMiddleware
