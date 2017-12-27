const _ = require('lodash')

const jsonApiPatchCustomizer = (objValue, srcValue, key, object, source, stack) => {
  if (null === srcValue && _.isArray(object)) {
    return objValue
  }
}

console.log(`foo, bar ${JSON.stringify(_.mergeWith({foo: 42}, {bar: 13}, jsonApiPatchCustomizer))}`)
console.log(`null, bar ${JSON.stringify(_.mergeWith(null, {bar: 13}, jsonApiPatchCustomizer))}`)
console.log(`foo, null ${JSON.stringify(_.mergeWith({foo: 42}, null, jsonApiPatchCustomizer))}`)
console.log(`null, null ${JSON.stringify(_.mergeWith(null, null, jsonApiPatchCustomizer))}`)
console.log(`undefined, bar ${JSON.stringify(_.mergeWith(undefined, {bar: 13}, jsonApiPatchCustomizer))}`)
console.log(`foo, undefined ${JSON.stringify(_.mergeWith({foo: 42}, undefined, jsonApiPatchCustomizer))}`)
console.log(`undefined, undefined ${JSON.stringify(_.mergeWith(undefined, undefined, jsonApiPatchCustomizer))}`)
