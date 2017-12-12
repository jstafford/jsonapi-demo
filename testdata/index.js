const mocker = require('mocker-data-generator').default

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
  string: (faker) => {return faker.random.words()},
  number: (faker) => {
    const precision = 1/Math.pow(10, Math.floor(Math.random() * 4))
    return faker.random.number({max: 999999, 
    min: -999999, 
    precision: precision})
  },
  integer: (faker) => {return faker.random.number({max: 999999, min: -999999, precision: 1})},
  boolean: (faker) => {return faker.random.boolean()},
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
  geopoint: (faker) => {return `${faker.address.longitude()}, ${faker.address.latitude()}`}
}

const user = {
  id: {
    faker: 'random.uuid'
  },
  username: {
    faker: 'internet.userName'
  },
  createdAt: {
    faker: 'date.past'
  }
};
const table = {
  id: {
    faker: 'random.uuid'
  },
  title: {
    faker: 'random.words'
  },
  description: {
    faker: 'lorem.sentence'
  },
  fields: [{
    function: function() {
      return {
        name: this.faker.random.word(),
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
      return this.faker.random.arrayElement(this.db.user).id
    }
  }
};

mocker()
  .schema('user', user, 10)
  .schema('table', table, 1)
  .build()
  .then(data => {
    console.log(JSON.stringify(data, null, 2))
    console.log('done')
  }, err => console.error(err))
