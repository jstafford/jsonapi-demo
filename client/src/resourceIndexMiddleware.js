import {isArray, isObject} from 'lodash'
import {createAction} from 'redux-actions'
import {readEndpoint} from 'redux-json-api'
import warning from 'warning'
import {indexRefresh} from './resourceIndexReducer'
import resource from './resource'

const INDEX_ENSURE_RESOURCE = 'INDEX_ENSURE_RESOURCE'

export const ensureResource = createAction(INDEX_ENSURE_RESOURCE)

const handleEnsureResource = (store, action) => {
  const {type, id, include} = action.payload
  const state = store.getState()
  const resourceIndex = state.resourceIndex && state.resourceIndex[type] && state.resourceIndex[type][id] ?
    state.resourceIndex[type][id] : undefined
  const resource = resourceIndex !== undefined ? state.api[type].data[resourceIndex] : null
  if (!resource) {
    const url = include ? `${type}/${id}?include=${include}` : `${type}/${id}`
    store.dispatch(readEndpoint(url))
  } else {
    if (include) {
      const includeList = resource.relationships[include].data
      if (includeList) {
        const missingResources = {}
        includeList.forEach(item => {
          const haveInclude = state.resourceIndex && state.resourceIndex[item.type] && state.resourceIndex[item.type][item.id]
          if (!haveInclude) {
            if (!missingResources.hasOwnProperty(item.type)) {
              missingResources[item.type] = []
            }
            missingResources[item.type].push(item.id)
          }
        })
        const missingTypes = Object.keys(missingResources)
        missingTypes.forEach(missingType => {
          let url = `${missingType}/?`
          const ids = missingResources[missingType]
          let and = ''
          ids.forEach(id => {
            url += `${and}filter[id]=${id}`
            and = '&'
          })
          store.dispatch(readEndpoint(url))
        })
      }

      const url = include ? `${type}/${id}?include=${include}` : `${type}/${id}`
      store.dispatch(readEndpoint(url))
    }
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
