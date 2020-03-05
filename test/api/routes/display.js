'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')

const TEST_SUBJECT = '../../../lib/api/routes/display.js'

const CWD = 'current working directory'
const ROUTES = [
  {
    route: '/',
    module: './api/root.js',
  },
  {
    route: '/api/books/:id',
    module: './api/book.js',
  },
  {
    route: '/api/books',
    module: 'api/books.js',
  },
]

test.beforeEach(t => {
  t.context.getTestSubject = overrides => {
    overrides = overrides || {}
    return proxyquire(
      TEST_SUBJECT,
      Object.assign(
        {
          './read.js': () => Promise.resolve(ROUTES),

          './validate.js': () => Promise.resolve([]),
        },
        overrides,
      ),
    )
  }

  t.context.logger = {
    log: () => {},
  }
})

test('Should call read() with correct input', t => {
  t.plan(1)
  const display = t.context.getTestSubject({
    './read.js': cwd => {
      t.is(cwd, CWD)
      return Promise.resolve(ROUTES)
    },
  })

  return display(t.context.logger, CWD)
})

test('Should log the routes and reject if no routes are found', t => {
  t.plan(1)
  const display = t.context.getTestSubject({
    './read.js': () => Promise.resolve([]),
  })

  return display(
    { log: () => t.fail('Should not log if there are no routes') },
    CWD,
  ).catch(() => t.pass())
})

test('Should call validate() for each route returned from read()', t => {
  t.plan(ROUTES.length)
  const display = t.context.getTestSubject({
    './validate.js': () => {
      t.pass()
      return Promise.resolve([])
    },
  })

  return display(t.context.logger, CWD)
})

test('Should log the table if no errors resolve if no errors are returned from validate', t => {
  t.plan(1)
  const display = t.context.getTestSubject()

  return display({ log: () => t.pass() }, CWD)
})

test('Should log the table and reject if errors are return from validate()', t => {
  t.plan(2)
  const display = t.context.getTestSubject({
    './validate.js': () => Promise.resolve(['error1', 'error2']),
  })

  return display({ log: () => t.pass() }, CWD).catch(() => t.pass())
})
