const fs = require('fs')
const mocker = require('mocker-data-generator').default
const pg = require('pg')

const jsonStr = fs.readFileSync('./tags.json')
const tagChoices = JSON.parse(jsonStr)

// using datatypes and format adapted from https://frictionlessdata.io/specs/table-schema/
const validTypes = [
  'string',
  'number',
  'integer',
  'boolean',
  'date',
  'time',
  'datetime',
  'year',
  'yearmonth',
  'geopoint'
]

const dataGenerators = {
  string: (faker) => {
    return faker.random.words()
  },
  number: (faker) => {
    const precision = 1 / Math.pow(10, Math.floor(Math.random() * 4))
    return faker.random.number({
      max: 999999,
      min: -999999,
      precision: precision
    })
  },
  integer: (faker) => {
    return faker.random.number({
      max: 999999,
      min: -999999,
      precision: 1
    })
  },
  boolean: (faker) => {
    return faker.random.boolean()
  },
  date: (faker) => {
    const date = faker.date.between(new Date(1680, 0, 1), new Date(2099, 11, 31))
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${date.getFullYear()}-${month}-${day}`
  },
  time: (faker) => {
    const date = faker.date.between(new Date(1970, 0, 1), new Date(1970, 0, 2))
    const hour = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${hour}:${minutes}:${seconds}`
  },
  datetime: (faker) => {
    const date = faker.date.between(new Date(1680, 0, 1), new Date(2099, 11, 31))
    return date.toISOString()
  },
  year: (faker) => {
    const date = faker.date.between(new Date(1680, 0, 1), new Date(2099, 11, 31))
    return `${date.getFullYear()}`
  },
  yearmonth: (faker) => {
    const date = faker.date.between(new Date(1680, 0, 1), new Date(2099, 11, 31))
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${date.getFullYear()}-${month}`
  },
  geopoint: (faker) => {
    return `${faker.address.longitude()}, ${faker.address.latitude()}`
  }
}

const users = {
  type: {
    function: function() {
      return 'users'
    }
  },
  id: {
    faker: 'random.uuid'
  },
  name: {
    faker: 'internet.userName'
  },
  createdDate: {
    faker: 'date.past'
  },
  updatedDate: {
    faker: 'date.recent'
  },
  tables: {
    function: function() {
      return []
    }
  },
  tablesCount: {
    function: function() {
      return 0
    }
  },
  stars: {
    function: function() {
      return this.faker.random.number({
        max: 9999,
        min: 0,
        precision: 1
      })
    }
  },
};
const tables = {
  type: {
    function: function() {
      return 'tables'
    }
  },
  id: {
    faker: 'random.uuid'
  },
  createdDate: {
    faker: 'date.past'
  },
  updatedDate: {
    faker: 'date.recent'
  },
  title: {
    function: function() {
      const randomWords = this.faker.random.words().toLowerCase()
      const title = randomWords.replace(/^(.)|\s(.)/g, ($1) => $1.toUpperCase())
      return title
    }
  },
  description: {
    faker: 'lorem.sentence'
  },
  fields: [{
    function: function() {
      const randomWord = this.faker.random.word().toLowerCase()
      const name = this.faker.helpers.slugify(randomWord)
      const title = randomWord.replace(/^(.)|\s(.)/g, ($1) => $1.toUpperCase())
      return {
        name: name,
        title: title,
        description: this.faker.lorem.sentence(),
        type: this.faker.random.arrayElement(validTypes)
      }
    },
    length: 20,
    fixedLength: false
  }],
  rows: [{
    function: function() {
      const numFields = this.object.fields.length
      row = []
      for (let i = 0; i < numFields; i++) {
        const type = this.object.fields[i].type
        const value = dataGenerators[type](this.faker)
        row.push(value)
      }
      return row
    },
    length: 200,
    fixedLength: false
  }],
  owner: {
    function: function() {
      const owner = this.faker.random.arrayElement(this.db.users)
      owner.tables.push({
        type: 'tables',
        id: this.object.id
      })
      owner.tablesCount += 1
      return {
        type: 'users',
        id: owner.id
      }
    }
  },
  tags: [{
    function: function() {
      const tag = this.faker.random.arrayElement(tagChoices)
      return {
        type: 'tags',
        id: tag
      }
    },
    length: 5,
    fixedLength: false
  }],
};

const getRandomInt = (max) => {
  max = Math.floor(max)
  return Math.floor(Math.random() * max)
}

const getRandomInts = (max, count, exclude) => {
  const ints = []
  while (ints.length < count) {
    const rand = getRandomInt(max)
    if (rand != exclude && ints.indexOf(rand) < 0) {
      ints.push(rand)
    }
  }
  return ints
}

const addUserWithLotsOfTables = async (data) => {
  const newData = await mocker()
    .schema('users', users, 1)
    .schema('tables', tables, 200)
    .build()

  data.users = data.users.concat(newData.users)
  data.tables = data.tables.concat(newData.tables)

  return data
}

const addTags = async (data) => {
  const uniqueTagsSet = new Set(tagChoices)
  const uniqueTags = Array.from(uniqueTagsSet)
  const tags = uniqueTags.map(tagName => ({type:'tags', id: tagName, count:0}))
  data.tags = tags

  return data
}


const addFollowers = async (data) => {
  data.users.forEach((user, index) => {
    user.follows = []
    const count = getRandomInt(data.users.length/8)
    const indexes = getRandomInts(data.users.length, count, index)
    for (let i=0; i < count; i++) {
      const following = data.users[indexes[i]]
      user.follows.push({
        type: following.type,
        id: following.id
      })
    }
  })
  return data
}

const addStars = async (data) => {
  data.users.forEach((user, index) => {
    user.stars = []
    const count = getRandomInt(data.tables.length/5)
    const indexes = getRandomInts(data.tables.length, count, NaN)
    for (let i=0; i < count; i++) {
      const starred = data.tables[indexes[i]]
      user.stars.push({
        type: starred.type,
        id: starred.id
      })
    }
  })
  return data
}

const totalReducer = (accumulator, currentValue) => accumulator + currentValue;

const genNumberStats = (table, index) => {
  const values = []
  values.length = table.rows.length
  table.rows.forEach((row, i) => {
    values[i] = row[index]
  })
  const total = values.reduce(totalReducer, 0)
  const statblock = []
  statblock.push({
    name: 'min',
    value: Math.min(...values)
  })
  statblock.push({
    name: 'mean',
    value: total/values.length
  })
  statblock.push({
    name: 'max',
    value: Math.max(...values)
  })
  statblock.push({
    name: 'total',
    value: total
  })
  return statblock
}

const genBooleanStats = (table, index) => {
  let numTrue = 0
  let numFalse = 0
  table.rows.forEach(row => {
    if (row[index]) {
      numTrue += 1
    } else {
      numFalse += 1
    }
  })
  const statblock = []
  statblock.push({
    name: 'true',
    value: numTrue
  })
  statblock.push({
    name: 'false',
    value: numFalse
  })
  return statblock
}

const genDateStats = (table, index) => {
  const values = []
  values.length = table.rows.length
  table.rows.forEach((row, i) => {
    values[i] = row[index]
  })
  values.sort()
  const statblock = []
  statblock.push({
    name: 'min',
    value: values[0]
  })
  statblock.push({
    name: 'median',
    value: values[Math.round(values.length/2)]
  })
  statblock.push({
    name: 'max',
    value: values[values.length - 1]
  })
  return statblock
}

const genGeoStats = (table, index) => {
  const numRows = table.rows.length
  const longitudes = []
  const latitudes = []
  longitudes.length = numRows
  latitudes.length = numRows
  table.rows.forEach((row, i) => {
    const geopoint = row[index].split(', ')
    longitudes[i] = 1 * geopoint[0]
    latitudes[i] = 1 * geopoint[1]
  })
  const avgLongitude = longitudes.reduce(totalReducer, 0) / numRows
  const avgLatitudes = latitudes.reduce(totalReducer, 0) / numRows
  const maxLatitude = Math.max(...latitudes)
  const maxLatitudeIndex = latitudes.indexOf(maxLatitude)
  const minLatitude = Math.min(...latitudes)
  const minLatitudeIndex = latitudes.indexOf(minLatitude)

  const statblock = []
  statblock.push({
    name: 'center',
    value: `${Number(avgLongitude).toFixed(4)}, ${Number(avgLatitudes).toFixed(4)}`
  })
  statblock.push({
    name: 'northmost',
    value: `${longitudes[maxLatitudeIndex]}, ${latitudes[maxLatitudeIndex]}`
  })
  statblock.push({
    name: 'southmost',
    value: `${longitudes[minLatitudeIndex]}, ${latitudes[minLatitudeIndex]}`
  })
  return statblock
}

const addTableStats = async (data) => {
  data.tables.forEach((table, index) => {
    table.stats = []
    table.fields.forEach((field, index) => {
      let statblock
      switch (field.type) {
        case 'string':
          statblock = []
          break
        case 'number':
        case 'integer':
          statblock = genNumberStats(table, index)
          break
        case 'boolean':
          statblock = genBooleanStats(table, index)
          break
        case 'date':
        case 'time':
        case 'datetime':
        case 'year':
        case 'yearmonth':
          statblock = genDateStats(table, index)
          break
        case 'geopoint':
          statblock = genGeoStats(table, index)
          break
      }
      table.stats.push(statblock)
    })
  })
  return data
}

const addManagedFields = async (data) => {
  const usersIndex = {}
  data.users.forEach((user, index) => {
    usersIndex[user.id] = index
    user.followersCount = 0
  })

  const tablesIndex = {}
  data.tables.forEach((table, index) => {
    tablesIndex[table.id] = index
    table.starsCount = 0
    table.rowsCount = table.rows.length
    table.columnsCount = table.fields.length
  })

  const tagsIndex = {}
  data.tags.forEach((tag, index) => {
    tagsIndex[tag.id] = index
  })

  data.users.forEach(user => {
    user.follows.forEach(following => {
      data.users[usersIndex[following.id]].followersCount += 1
    })
    user.stars.forEach(starred => {
      data.tables[tablesIndex[starred.id]].starsCount += 1
    })
  })

  data.tables.forEach(table => {
    table.tags.forEach(tag => {
      data.tags[tagsIndex[tag.id]].count += 1
    })
  })

  return data
}
const poolErrorLogger = (err, client) => {
  console.error(err)
}

const writeData = async (data) => {
  try {
    // console.log(JSON.stringify(data, null, 2))
    // return

    const options = {
      host: 'localhost',
      port: 5432,
      user: 'jsonapi',
      password: 'jsonapi',
      database: 'jsonapi'
    }
    const pool = new pg.Pool(options)

    pool.on('error', poolErrorLogger)
    const client = await pool.connect()
    client.release()

    // create tables
    await pool.query('CREATE TABLE IF NOT EXISTS users (id uuid NOT NULL UNIQUE PRIMARY KEY, data jsonb);')
    await pool.query('CREATE INDEX IF NOT EXISTS users_data_idx ON users USING gin(data jsonb_path_ops);')

    await pool.query('CREATE TABLE IF NOT EXISTS tables (id uuid NOT NULL UNIQUE PRIMARY KEY, data jsonb);')
    await pool.query('CREATE INDEX IF NOT EXISTS tables_data_idx ON tables USING gin(data jsonb_path_ops);')

    await pool.query('CREATE TABLE IF NOT EXISTS tags (id varchar NOT NULL UNIQUE PRIMARY KEY, data jsonb);')
    await pool.query('CREATE INDEX IF NOT EXISTS tags_data_idx ON tags USING gin(data jsonb_path_ops);')

    await Promise.all(data.users.map(async (user, index) => {
      await pool.query('INSERT INTO users (id, data) VALUES($1, $2);', [user.id, JSON.stringify(user)])
      console.log(`saved user ${user.name}`)
    }));

    await Promise.all(data.tables.map(async (table, index) => {
      await pool.query('INSERT INTO tables (id, data) VALUES($1, $2);', [table.id, JSON.stringify(table)])
      console.log(`saved table ${table.title}`)
    }));

    await Promise.all(data.tags.map(async (tag, index) => {
      await pool.query('INSERT INTO tags (id, data) VALUES($1, $2);', [tag.id, JSON.stringify(tag)])
      console.log(`saved tag ${tag.id}`)
    }));

  } catch (err) {
    throw err
  }
}

mocker()
  .schema('users', users, 200)
  .schema('tables', tables, 2000)
  .build()
  .then(addUserWithLotsOfTables, err => console.error(err))
  .then(addTags,  err => console.error(err))
  .then(addFollowers,  err => console.error(err))
  .then(addStars,  err => console.error(err))
  .then(addTableStats, err => console.error(err))
  .then(addManagedFields, err => console.error(err))
  .then(writeData, err => console.error(err))
  .then(console.log('done'), err => console.error(err))
