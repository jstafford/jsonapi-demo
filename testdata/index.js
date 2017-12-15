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

    await Promise.all(data.users.map(async (user) => {
      await pool.query('INSERT INTO users (id, data ) VALUES($1, $2);', [user.id, JSON.stringify(user)])
      console.log(`saved user ${user.name}`)
    }));

    await Promise.all(data.tables.map(async (table) => {
      await pool.query('INSERT INTO tables (id, data ) VALUES($1, $2);', [table.id, JSON.stringify(table)])
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
  .then(writeData, err => console.error(err))
  .then(console.log('done'), err => console.error(err))
