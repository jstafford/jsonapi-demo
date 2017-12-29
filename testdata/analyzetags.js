const fs = require('fs')
const _ = require('lodash')

const jsonStr = fs.readFileSync('./kaggleTop100Tags.json')
const topTags = JSON.parse(jsonStr)
const tags = topTags.list.categories

console.log(`Number of tags: ${tags.length}`)

const totalReducer = (accumulator, currentValue) => accumulator + currentValue.datasetCount;

const total = tags.reduce(totalReducer, 0)
console.log(`Number of uses: ${total}`)

const cleanTags = tags.map(tag => ({name: tag.name, count: Math.ceil(tag.datasetCount/3)}))
const sortedCleanTags = _.sortBy(cleanTags, [(tag) => (tag.count)])
//console.log(JSON.stringify(sortedCleanTags, null, 2))

const cleanTotalReducer = (accumulator, currentValue) => accumulator + currentValue.count;
const cleanTotal = sortedCleanTags.reduce(cleanTotalReducer, 0)
console.log(`Number of uses: ${cleanTotal}`)

const tagChoices = []

sortedCleanTags.forEach(tag => {
  for(let i = 0; i<tag.count; i++) {
    tagChoices.push(tag.name)
  }
})

// console.log(JSON.stringify(tagChoices, null, 2))
const tagChoiceStr = JSON.stringify(tagChoices, null, 2)
fs.writeFileSync('./tags.json', tagChoiceStr)
console.log('wrote ./tags.json')
