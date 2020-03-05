'use strict'

const path = require('path')

const test = require('ava')

const lib = require('../../lib/api/handlers.js')
const BmResponse = require('../../lib/api/bm-response.js')

const EXAMPLE_DIR = path.join(
  __dirname,
  '..',
  '..',
  'examples',
  'api',
  'directory',
)
const CONFIGURATION_DIR = path.join(
  __dirname,
  '..',
  '..',
  'examples',
  'api',
  'configuration',
)

test('executeHandler() should call handler()', t => {
  t.plan(1)
  const request = {}
  const handler = req => {
    t.is(req, request)
  }
  return lib.executeHandler(handler, request)
})

test('executeHandler() should return a BmResponse with correct values', t => {
  const statusCode = 1
  const payload = {
    key: 'value',
  }
  const headers = {
    one: '1',
    two: '2',
  }
  return lib
    .executeHandler((request, response) => {
      response.setStatusCode(statusCode)
      response.setPayload(payload)
      Object.keys(headers).forEach(key => response.setHeader(key, headers[key]))
    })
    .then(response => {
      t.truthy(response instanceof BmResponse)
      t.is(response.statusCode, statusCode)
      t.deepEqual(response.payload, payload)
      t.deepEqual(response.headers, headers)
    })
})

test('executeHandler() should return a BmResponse with status code set from handler that return number', t => {
  return lib
    .executeHandler(() => 201)
    .then(response => t.is(response.statusCode, 201))
})

test('executeHandler() should return a BmResponse with payload set from handler that return a truthy value that is not a number', t => {
  return lib
    .executeHandler(() => 'payload')
    .then(response => t.is(response.payload, 'payload'))
})

test('getHandler() valid modules', t => {
  const tests = [
    {
      args: [path.join(EXAMPLE_DIR, 'helloworld'), 'get'],
      expected: 'function',
    },
    { args: [path.join(EXAMPLE_DIR, 'methods'), 'get'], expected: 'function' },
    { args: [path.join(EXAMPLE_DIR, 'methods'), 'patch'], expected: 'object' },
    {
      args: [path.join(CONFIGURATION_DIR, 'api/request'), 'get'],
      expected: 'function',
    },
    {
      args: [path.join(CONFIGURATION_DIR, 'api/books'), 'get'],
      expected: 'function',
    },
    {
      args: [path.join(CONFIGURATION_DIR, 'api/books'), 'patch'],
      expected: 'object',
    },
  ]
  return tests.reduce((prev, config) => {
    return prev
      .then(() => lib.getHandler.apply(null, config.args))
      .then(result => t.is(typeof result, config.expected))
  }, Promise.resolve())
})

test('getHandler() invalid modules', async t => {
  const tests = [
    {
      args: [path.join(EXAMPLE_DIR, 'missing'), 'get'],
      expected: path.join(EXAMPLE_DIR, 'missing'),
    },
    {
      args: [path.join(CONFIGURATION_DIR, 'api/missing'), 'get'],
      expected: path.join(CONFIGURATION_DIR, 'api/missing'),
    },
  ]
  for (const { expected, args } of tests) {
    try {
      await lib.getHandler.apply(null, args)
      t.fail()
    } catch (error) {
      t.true(error.message.includes('Cannot find module'))
      t.true(error.message.includes(expected))
    }
  }
})
