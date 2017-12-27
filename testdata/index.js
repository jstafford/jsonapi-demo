const mocker = require('mocker-data-generator').default
const pg = require('pg')

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
  joinDate: {
    faker: 'date.past'
  },
  lastChange: {
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

const addFollowers = async (data) => {
  // data.usersmeta = []
  // data.usersmeta.length = data.users.length
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

const addMeta = async (data) => {
  data.usersmeta = []
  data.usersmeta.length = data.users.length
  const usersIndex = {}
  data.users.forEach((user, index) => {
    usersIndex[user.id] = index
    const usermeta = {
      followersCount: 0,
      tablesCount: user.tablesCount,
      createdDate: user.joinDate,
      updatedDate: user.lastChange,
    }
    data.usersmeta[index] = usermeta
    delete user.tablesCount
    delete user.joinDate
    delete user.lastChange
  })

  data.tablesmeta = []
  data.tablesmeta.length = data.users.length
  const tablesIndex = {}
  data.tables.forEach((table, index) => {
    tablesIndex[table.id] = index
    const tablemeta = {
      starsCount: 0,
      rowsCount: table.rows.length,
      columnsCount: table.fields.length,
      createdDate: table.createdDate,
      updatedDate: table.updatedDate,
    }
    data.tablesmeta[index] = tablemeta
    delete table.createdDate
    delete table.updatedDate
  })


  data.users.forEach(user => {
    user.follows.forEach(following => {
      data.usersmeta[usersIndex[following.id]].followersCount += 1
    })
    user.stars.forEach(starred => {
      data.tablesmeta[tablesIndex[starred.id]].starsCount += 1
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
    await pool.query('CREATE TABLE IF NOT EXISTS users (id uuid NOT NULL UNIQUE PRIMARY KEY, data jsonb, meta jsonb);')
    await pool.query('CREATE INDEX IF NOT EXISTS users_data_idx ON users USING gin(data jsonb_path_ops);')
    await pool.query('CREATE INDEX IF NOT EXISTS users_meta_idx ON users USING gin(meta jsonb_path_ops);')

    await pool.query('CREATE TABLE IF NOT EXISTS tables (id uuid NOT NULL UNIQUE PRIMARY KEY, data jsonb, meta jsonb);')
    await pool.query('CREATE INDEX IF NOT EXISTS tables_data_idx ON tables USING gin(data jsonb_path_ops);')
    await pool.query('CREATE INDEX IF NOT EXISTS tables_meta_idx ON tables USING gin(meta jsonb_path_ops);')

    await Promise.all(data.users.map(async (user, index) => {
      const meta = data.usersmeta[index]
      await pool.query('INSERT INTO users (id, data, meta) VALUES($1, $2, $3);', [user.id, JSON.stringify(user), JSON.stringify(meta)])
      console.log(`saved user ${user.name}`)
    }));

    await Promise.all(data.tables.map(async (table, index) => {
      const meta = data.tablesmeta[index]
      await pool.query('INSERT INTO tables (id, data, meta) VALUES($1, $2, $3);', [table.id, JSON.stringify(table), JSON.stringify(meta)])
      console.log(`saved table ${table.title}`)
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
  .then(addFollowers,  err => console.error(err))
  .then(addStars,  err => console.error(err))
  .then(addMeta, err => console.error(err))
  .then(writeData, err => console.error(err))
  .then(console.log('done'), err => console.error(err))
