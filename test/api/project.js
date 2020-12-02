'use strict'

const path = require('path')

const test = require('ava')

const lib = require('../../lib/api/project.js')
const values = require('../../lib/api/values.js')

const EXAMPLE_DIR = path.join(
  __dirname,
  '..',
  '..',
  'examples',
  'api',
  'directory',
)

test('listAPIs()', (t) => {
  const expected = [
    'boom',
    'helloworld',
    'methods',
    'promise',
    'request',
    'response',
  ]
  return lib
    .listAPIs(EXAMPLE_DIR)
    .then((results) => t.deepEqual(results, expected))
})

test('listRoutes()', (t) => {
  const expected = [
    {
      route: '/boom',
      module: './boom/index.js',
      timeout: values.DEFAULT_TIMEOUT_SECONDS,
    },
    {
      route: '/helloworld',
      module: './helloworld/index.js',
      timeout: values.DEFAULT_TIMEOUT_SECONDS,
    },
    {
      route: '/methods',
      module: './methods/index.js',
      timeout: values.DEFAULT_TIMEOUT_SECONDS,
    },
    {
      route: '/promise',
      module: './promise/index.js',
      timeout: values.DEFAULT_TIMEOUT_SECONDS,
    },
    {
      route: '/request',
      module: './request/index.js',
      timeout: values.DEFAULT_TIMEOUT_SECONDS,
    },
    {
      route: '/response',
      module: './response/index.js',
      timeout: values.DEFAULT_TIMEOUT_SECONDS,
    },
  ]
  return lib
    .listRoutes(EXAMPLE_DIR)
    .then((results) => t.deepEqual(results, expected))
})
