const fs = require('fs')
const _ = require('lodash')

// const jsonStr = fs.readFileSync('./kaggleAllTags.json')
const jsonStr = fs.readFileSync('./kaggleTop100Tags.json')
const allTags = JSON.parse(jsonStr)
const tags = allTags.list.categories

console.log(`Number of tags: ${tags.length}`)

const tree = {}

tags.forEach(tag => {
  const pathParts = tag.fullPath.split(' > ')
  let curObj = tree
  for (let i = 0; i < pathParts.length; i++) {
    if (!curObj[pathParts[i]]) {
      curObj[pathParts[i]] = {}
    }

    curObj = curObj[pathParts[i]]

    if (i === (pathParts.length - 1)) {
      curObj.count = tag.datasetCount
    }
  }
})

console.log(JSON.stringify(tree, null, 2))
// console.log(JSON.stringify(Object.keys(tree), null, 2))
