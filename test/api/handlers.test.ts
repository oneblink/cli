import path from 'path'

import lib from '../../src/api/handlers'
import BmResponse from '../../src/api/bm-response'
import { APITypes } from '@oneblink/types'

describe('handlers', () => {
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

  const request: APITypes.OneBlinkAPIHostingRequest<undefined> = {
    body: undefined,
    headers: {},
    method: 'GET',
    route: '/',
    url: {
      host: 'example.com',
      hostname: 'example.com:443',
      params: {},
      pathname: '/',
      protocol: 'https:',
      query: {},
    },
  }

  test('executeHandler() should call handler()', () => {
    expect.assertions(1)
    return lib.executeHandler<undefined, undefined>(
      (req: APITypes.OneBlinkAPIHostingRequest<undefined>) => {
        expect(req).toBe(request)
      },
      request,
    )
  })

  test('executeHandler() should return a BmResponse with correct values', () => {
    const statusCode = 1
    const payload: Record<string, string> = {
      key: 'value',
    }
    const headers: APITypes.OneBlinkAPIHostingRequest<undefined>['headers'] = {
      one: '1',
      two: '2',
    }
    return lib
      .executeHandler<undefined, typeof payload>((request, response) => {
        response.setStatusCode(statusCode)
        response.setPayload(payload)
        Object.keys(headers).forEach((key) =>
          response.setHeader(key, headers[key].toString()),
        )
      }, request)
      .then((response) => {
        expect(response instanceof BmResponse).toBeTruthy()
        expect(response.statusCode).toBe(statusCode)
        expect(response.payload).toEqual(payload)
        expect(response.headers).toEqual(headers)
      })
  })

  test('executeHandler() should return a BmResponse with status code set from handler that return number', () => {
    return lib
      .executeHandler<undefined, undefined>(() => 201, request)
      .then((response) => expect(response.statusCode).toBe(201))
  })

  test('executeHandler() should return a BmResponse with payload set from handler that return a truthy value that is not a number', () => {
    return lib
      .executeHandler<undefined, string>(() => 'payload', request)
      .then((response) => expect(response.payload).toBe('payload'))
  })

  test('getHandler() valid modules', async () => {
    const tests = [
      {
        module: path.join(EXAMPLE_DIR, 'helloworld'),
        method: 'get',
        expected: 'function',
      },
      {
        module: path.join(EXAMPLE_DIR, 'methods'),
        method: 'get',
        expected: 'function',
      },
      {
        module: path.join(EXAMPLE_DIR, 'methods'),
        method: 'patch',
        expected: 'object',
      },
      {
        module: path.join(CONFIGURATION_DIR, 'api/request'),
        method: 'get',
        expected: 'function',
      },
      {
        module: path.join(CONFIGURATION_DIR, 'api/books'),
        method: 'get',
        expected: 'function',
      },
      {
        module: path.join(CONFIGURATION_DIR, 'api/books'),
        method: 'patch',
        expected: 'object',
      },
    ]
    for (const { expected, method, module } of tests) {
      const result = await lib.getHandler(module, method)
      expect(typeof result).toBe(expected)
    }
  })

  test('getHandler() invalid modules', async () => {
    const tests = [
      {
        module: path.join(EXAMPLE_DIR, 'missing'),
        method: 'get',
      },
      {
        module: path.join(CONFIGURATION_DIR, 'api/missing'),
        method: 'get',
      },
    ]
    expect.assertions(tests.length * 2)
    for (const { method, module } of tests) {
      try {
        await lib.getHandler(module, method)
      } catch (error) {
        expect(error.message.includes('Cannot find module')).toBe(true)
        expect(error.message.includes(module)).toBe(true)
      }
    }
  })
})
