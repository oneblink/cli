/* @flow */
'use strict'

const test /* : Function */ = require('ava')
const proxyquire = require('proxyquire')

const TEST_SUBJECT = '../../../lib/api/routes/get-route-config.js'

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

function getTestSubject(overrides) {
  overrides = overrides || {}
  return proxyquire(
    TEST_SUBJECT,
    Object.assign(
      {
        './read.js': () => Promise.resolve(ROUTES),
      },
      overrides,
    ),
  )
}

test('should return route config', t => {
  const lib = getTestSubject()
  return lib(CWD, '/api/books/:id').then(routeConfig =>
    t.deepEqual(routeConfig, ROUTES[1]),
  )
})

test('should reject if a project does not contain route', t => {
  const lib = getTestSubject()
  // $FlowFixMe
  return t.throwsAsync(
    () => lib(CWD, '/route'),
    'Project does not contain route: /route',
  )
})
