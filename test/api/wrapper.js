'use strict'

const test = require('ava')

const lib = require('../../lib/api/wrapper.js')

test('keysToLowerCase()', t => {
  const input = { Hello: 'World!' }
  const expected = { hello: 'World!' }
  t.deepEqual(lib.keysToLowerCase(input), expected)
})

test('normaliseMethod()', t => {
  t.is(lib.normaliseMethod('GET'), 'get')
})

test('protocolFromHeaders() with no headers', t => {
  t.is(lib.protocolFromHeaders({}), 'http:')
  t.is(lib.protocolFromHeaders({ 'x-forwarded-proto': 'https' }), 'https:')
  t.is(lib.protocolFromHeaders({ forwarded: 'abcproto=https123' }), 'https:')
  t.is(lib.protocolFromHeaders({ forwarded: 'abc123' }), 'http:')
  t.is(lib.protocolFromHeaders({ 'front-end-https': 'on' }), 'https:')
})
