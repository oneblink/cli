import { expect, test } from 'vitest'
import BmResponse from '../../src/api/bm-response.js'

test('constructor() should set correct defaults', () => {
  const bmResponse = new BmResponse()
  expect(bmResponse.statusCode).toBe(200)
  expect(bmResponse.payload).toBe(undefined)
  expect(bmResponse.headers).toEqual({})
})

test('setStatusCode() should set status code and return response', () => {
  const bmResponse = new BmResponse()
  const statusCode = 201
  expect(bmResponse.statusCode).not.toBe(statusCode)
  const result = bmResponse.setStatusCode(statusCode)
  expect(bmResponse.statusCode).toBe(statusCode)
  // Allow for chaining
  expect(bmResponse).toBe(result)
})

test('setPayload() should set payload and return response', () => {
  const bmResponse = new BmResponse()
  const payload = { key: 'value' }
  expect(bmResponse.payload).not.toEqual(payload)
  const result = bmResponse.setPayload(payload)
  expect(bmResponse.payload).toEqual(payload)
  // Allow for chaining
  expect(bmResponse).toBe(result)
})

test('setHeader() should set a header, allow for multiple headers and return response', () => {
  // Initial defaults
  const bmResponse = new BmResponse()
  expect(bmResponse.headers).toEqual({})

  // Allow for multiple
  bmResponse.setHeader('one', '1')
  bmResponse.setHeader('two', '2')
  expect(bmResponse.headers).toEqual({
    one: '1',
    two: '2',
  })

  // Allow for override
  const result = bmResponse.setHeader('two', 'two')
  expect(bmResponse.headers).toEqual({
    one: '1',
    two: 'two',
  })

  // Allow for chaining
  expect(bmResponse).toBe(result)
})
