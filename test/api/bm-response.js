'use strict'

const test = require('ava')

const BmResponse = require('../../lib/api/bm-response.js')

const REQUEST = {
  body: 'body of the request',
  headers: {
    key: 'value',
  },
  method: 'get',
  url: {
    host: 'localhost:3000',
    hostname: 'localhost',
    params: {
      id: '123',
    },
    pathname: '/response',
    protocol: 'http:',
    query: {
      search: 'this is a search string',
    },
  },
}

test('constructor() should set correct defaults', t => {
  const bmResponse = new BmResponse(REQUEST)
  t.is(bmResponse.statusCode, 200)
  t.is(bmResponse.payload, undefined)
  t.deepEqual(bmResponse.headers, {})
})

test('setStatusCode() should set status code and return response', t => {
  const bmResponse = new BmResponse(REQUEST)
  const statusCode = 201
  t.not(bmResponse.statusCode, statusCode)
  const result = bmResponse.setStatusCode(statusCode)
  t.is(bmResponse.statusCode, statusCode)
  // Allow for chaining
  t.is(bmResponse, result)
})

test('setPayload() should set payload and return response', t => {
  const bmResponse = new BmResponse(REQUEST)
  const payload = { key: 'value' }
  t.notDeepEqual(bmResponse.payload, payload)
  const result = bmResponse.setPayload(payload)
  t.deepEqual(bmResponse.payload, payload)
  // Allow for chaining
  t.is(bmResponse, result)
})

test('setHeader() should set a header, allow for multiple headers and return response', t => {
  // Initial defaults
  const bmResponse = new BmResponse(REQUEST)
  t.deepEqual(bmResponse.headers, {})

  // Allow for multiple
  bmResponse.setHeader('one', '1')
  bmResponse.setHeader('two', '2')
  t.deepEqual(bmResponse.headers, {
    one: '1',
    two: '2',
  })

  // Allow for override
  const result = bmResponse.setHeader('two', 'two')
  t.deepEqual(bmResponse.headers, {
    one: '1',
    two: 'two',
  })

  // Allow for chaining
  t.is(bmResponse, result)
})
