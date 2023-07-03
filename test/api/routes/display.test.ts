import { describe, expect, test, jest } from '@jest/globals'

describe('display', () => {
  const CWD = 'current working directory'
  const ROUTES = [
    {
      route: '/',
      module: './api/root.js',
    },
    {
      route: '/api/books/:id',
      module: './api/book.js',
    },
    {
      route: '/api/books',
      module: 'api/books.js',
    },
  ]

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('Should call read() with correct input and log', async () => {
    const spy = jest.spyOn(console, 'log')
    const mockRead = jest.fn(async () => ROUTES)
    jest.unstable_mockModule('api/routes/read', () => ({ default: mockRead }))
    jest.unstable_mockModule('api/routes/validate', () => ({
      default: async () => [],
    }))
    const { default: display } = await import('../../../src/api/routes/display')
    await display(console, CWD)
    expect(mockRead).toBeCalledWith(CWD)
    expect(spy).toBeCalled()
  })

  test('Should log the routes and reject if no routes and scheduled functions are found', async () => {
    const spy = jest.spyOn(console, 'log')
    jest.unstable_mockModule('api/scheduledFunctions/read', () => ({
      default: async () => [],
    }))
    jest.unstable_mockModule('api/routes/read', () => ({
      default: async () => [],
    }))

    const { default: display } = await import('../../../src/api/routes/display')
    const promise = display(console, CWD)
    await expect(promise).rejects.toThrow(
      'You cannot deploy without defining at least one route or scheduled function.',
    )
    expect(spy).not.toHaveBeenCalled()
  })

  test('Should call validate() for each route returned from read()', async () => {
    const mockValidate = jest.fn(async () => [])
    jest.unstable_mockModule('api/routes/read', () => ({
      default: async () => ROUTES,
    }))
    jest.unstable_mockModule('api/routes/validate', () => ({
      default: mockValidate,
    }))
    const { default: display } = await import('../../../src/api/routes/display')
    await display(console, CWD)
    expect(mockValidate).toBeCalledTimes(ROUTES.length)
  })

  test('Should log the table and reject if errors are return from validate()', async () => {
    const spy = jest.spyOn(console, 'log')
    jest.unstable_mockModule('api/routes/read', () => ({
      default: async () => ROUTES,
    }))
    jest.unstable_mockModule('api/routes/validate', () => ({
      default: async () => ['error1', 'error2'],
    }))

    const { default: display } = await import('../../../src/api/routes/display')
    const promise = display(console, CWD)
    await expect(promise).rejects.toThrow(
      '3 of 3 route configurations are invalid.',
    )
    expect(spy).toHaveBeenCalled()
  })
})
