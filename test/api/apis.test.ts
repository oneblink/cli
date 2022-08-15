import { describe, expect, test, jest } from '@jest/globals'
import path from 'path'
import url from 'url'
import { RouteConfiguration } from '../../src/api/types.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

describe('apis', () => {
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
  const ROUTE_CONFIG: RouteConfiguration = {
    route: '',
    module: path.join(CONFIGURATION_DIR, '/api/books'),
    params: {
      test: '123',
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

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('getRouteConfig() should find correct route and return route params', async () => {
    const { default: apis } = await import('../../src/api/apis.js')
    const routeConfig = await apis.getRouteConfig(
      CONFIGURATION_DIR,
      '/books/123/chapters/1',
    )
    expect(routeConfig).toEqual({
      route: '/books/{id}/chapters/{chapterNo}',
      module: path.resolve(CONFIGURATION_DIR, './api/chapter.js'),
      timeout: 15,
      params: {
        id: '123',
        chapterNo: '1',
      },
    })
  })

  test('getRouteConfig() should reject if route cannot be found', async () => {
    const { default: apis } = await import('../../src/api/apis.js')
    const promise = apis.getRouteConfig(CONFIGURATION_DIR, 'missing')
    await expect(promise).rejects.toThrow(
      'Route has not been implemented: missing',
    )
  })

  test('getRouteConfig() should pass correct arguments to readRoutes()', async () => {
    const mockRead = jest.fn()
    mockRead.mockImplementation(async () => ROUTES)
    jest.unstable_mockModule('api/routes/read', () => ({ default: mockRead }))
    const { default: apis } = await import('../../src/api/apis.js')
    await apis.getRouteConfig(EXAMPLE_DIR, ROUTES[0].route)
    expect(mockRead).toBeCalledWith(EXAMPLE_DIR)
  })

  test('getRouteConfig() should reject if readRoutes() throws an error', async () => {
    jest.unstable_mockModule('api/routes/read', () => ({
      default: async () => {
        throw new Error('test error')
      },
    }))
    const { default: apis } = await import('../../src/api/apis.js')
    const promise = apis.getRouteConfig(EXAMPLE_DIR, ROUTES[0].route)
    await expect(promise).rejects.toThrow('test error')
  })

  test('getHandlerConfig() should pass correct arguments to getHandler() and return correct result', async () => {
    const mockGetHandler = jest.fn(async () => async () => undefined)
    jest.unstable_mockModule('api/handlers', () => ({
      default: {
        getHandler: mockGetHandler,
      },
    }))
    const { default: apis } = await import('../../src/api/apis.js')
    const handlerConfig = await apis.getHandlerConfig(ROUTE_CONFIG, METHOD)
    expect(mockGetHandler).toBeCalledWith(ROUTE_CONFIG.module, METHOD)
    expect(typeof handlerConfig.handler).toBe('function')
    expect(handlerConfig.params).toEqual(ROUTE_CONFIG.params)
  })

  test('getHandlerConfig() should reject if getHandler() throws an error', async () => {
    jest.unstable_mockModule('api/handlers', () => ({
      default: {
        getHandler: async () => {
          throw new Error('test error')
        },
      },
    }))
    const { default: apis } = await import('../../src/api/apis.js')
    const promise = apis.getHandlerConfig(ROUTE_CONFIG, METHOD)
    await expect(promise).rejects.toThrow('test error')
  })
})
