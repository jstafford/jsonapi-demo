import {isArray, isObject} from 'lodash'
import warning from 'warning'
import resource from './resource'

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

export default generatePatch
