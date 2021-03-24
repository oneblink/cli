import { LambdaEvent } from '../../../src/api/types'

import lib from '../../../src/api/scripts/api-handler'

// Must run with in its own file as it changes process.chdir()
test('handler() should return 500 status code if current working directory cannot be changed', async () => {
  const EVENT: LambdaEvent = {
    httpMethod: 'GET',
    pathParameters: null,
    path: 'this is the path',
    queryStringParameters: null,
    body: '{"test": 123}',
    headers: {
      Host: 'this is the host',
    },
    resource: 'string',
  }
  const chdir = process.chdir
  process.chdir = () => {
    throw new Error('test chdir error')
  }
  const event = Object.assign({}, EVENT, { path: '/response' })

  const result = await lib.handler(event, {})
  expect(result).toEqual({
    body: JSON.stringify({
      error: 'Internal Server Error',
      message: 'An internal server error occurred',
      statusCode: 500,
    }),
    headers: {
      'content-type': 'application/json',
    },
    statusCode: 500,
  })
  process.chdir = chdir
})
