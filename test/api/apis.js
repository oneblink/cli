'use strict'

const path = require('path')

const TEST_SUBJECT = '../../lib/api/apis.js'

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
const ROUTE_CONFIG = {
  module: path.join(CONFIGURATION_DIR, '/api/books'),
  params: {
    test: 123,
  },
}
const METHOD = 'get'
const ROUTES = [
  {
    route: '/helloworld',
    module: './helloworld/index.js',
  },
  {
    route: '/api/books/{id}',
    module: './api/book.js',
  },
]

beforeEach(() => {
  t.context.getTestSubject = (overrides) => {
    overrides = overrides || {}
    return proxyquire(
      TEST_SUBJECT,
      Object.assign(
        {
          './handlers.js': {
            getHandler: (routeConfig) =>
              Promise.resolve({
                handler: () => {},
                params: routeConfig ? routeConfig.params : {},
              }),
          },
        },
        overrides,
      ),
    )
  }
})

test('getHandlerConfig() should pass correct arguments to getHandler()', () => {
  expect.assertions(2)
  const apis = t.context.getTestSubject({
    './handlers.js': {
      getHandler: (module, method) => {
        expect(module).toBe(ROUTE_CONFIG.module)
        expect(method).toBe(METHOD)
        return Promise.resolve()
      },
    },
  })
  return apis.getHandlerConfig(ROUTE_CONFIG, METHOD)
})

test('getHandlerConfig() should reject if getHandler() throws an error', () => {
  const apis = t.context.getTestSubject({
    './handlers.js': {
      getHandler: () => Promise.reject(new Error('test error')),
    },
  })
  return t.throwsAsync(() => apis.getHandlerConfig(ROUTE_CONFIG), {
    message: 'test error',
  })
})

test('getHandlerConfig() should return a handler from getHandler() and params from routeConfig', () => {
  const apis = t.context.getTestSubject({
    './handlers.js': {
      getHandler: () => Promise.resolve('this is my handler'),
    },
  })
  return apis.getHandlerConfig({ params: undefined }).then((handlerConfig) => {
    expect(handlerConfig.handler).toBe('this is my handler')
    expect(handlerConfig.params).toEqual({})
  });
})

test('getRouteConfig() should pass correct arguments to readRoutes()', () => {
  expect.assertions(1)
  const apis = t.context.getTestSubject({
    './routes/read.js': (cwd) => {
      expect(cwd).toBe(EXAMPLE_DIR)
      return Promise.resolve(ROUTES)
    },
  })
  return apis.getRouteConfig(EXAMPLE_DIR, ROUTES[0].route)
})

test('getRouteConfig() should reject if readRoutes() throws an error', () => {
  const apis = t.context.getTestSubject({
    './routes/read.js': () => Promise.reject(new Error('test error')),
  })
  return t.throwsAsync(() => apis.getRouteConfig(), { message: 'test error' })
})

test('getRouteConfig() should reject if route cannot be found', () => {
  const apis = t.context.getTestSubject()
  return t.throwsAsync(
    () => apis.getRouteConfig(CONFIGURATION_DIR, 'missing'),
    {
      message: 'Route has not been implemented: missing',
    },
  )
})

test('getRouteConfig() should find correct route and return route params', () => {
  const apis = t.context.getTestSubject()
  return apis
    .getRouteConfig(CONFIGURATION_DIR, '/books/123/chapters/1')
    .then((routeConfig) =>
      expect(routeConfig).toEqual({
        route: '/books/{id}/chapters/{chapterNo}',
        module: path.resolve(CONFIGURATION_DIR, './api/chapter.js'),
        timeout: 15,
        params: {
          id: '123',
          chapterNo: '1',
        },
      }),
    );
})
