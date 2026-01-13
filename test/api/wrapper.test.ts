import { expect, test } from 'vitest'
import lib from '../../src/api/wrapper.js'

test('keysToLowerCase()', () => {
  const input = { Hello: 'World!' }
  const expected = { hello: 'World!' }
  expect(lib.keysToLowerCase(input)).toEqual(expected)
})

test('normaliseMethod()', () => {
  expect(lib.normaliseMethod('GET')).toBe('get')
})

test('protocolFromHeaders() with no headers', () => {
  expect(lib.protocolFromHeaders({})).toBe('http:')
  expect(lib.protocolFromHeaders({ 'x-forwarded-proto': 'https' })).toBe(
    'https:',
  )
  expect(lib.protocolFromHeaders({ forwarded: 'abcproto=https123' })).toBe(
    'https:',
  )
  expect(lib.protocolFromHeaders({ forwarded: 'abc123' })).toBe('http:')
  expect(lib.protocolFromHeaders({ 'front-end-https': 'on' })).toBe('https:')
})
