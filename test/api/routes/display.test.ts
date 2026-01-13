import { afterEach, describe, expect, test, vi } from 'vitest'

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
    vi.resetModules()
    vi.clearAllMocks()
  })

  test('Should call read() with correct input and log', async () => {
    const spy = vi.spyOn(console, 'log')
    const mockRead = vi.fn(async () => ROUTES)
    vi.doMock('../../../src/api/routes/read', () => ({ default: mockRead }))
    vi.doMock('../../../src/api/routes/validate', () => ({
      default: async () => [],
    }))
    const { default: display } = await import(
      '../../../src/api/routes/display.js'
    )
    await display(console, CWD)
    expect(mockRead).toBeCalledWith(CWD)
    expect(spy).toBeCalled()
  })

  test('Should log the routes and reject if no routes and scheduled functions are found', async () => {
    const spy = vi.spyOn(console, 'log')
    vi.doMock('../../../src/api/scheduledFunctions/read', () => ({
      default: async () => [],
    }))
    vi.doMock('../../../src/api/routes/read', () => ({
      default: async () => [],
    }))

    const { default: display } = await import(
      '../../../src/api/routes/display.js'
    )
    const promise = display(console, CWD)
    await expect(promise).rejects.toThrow(
      'You cannot deploy without defining at least one route or scheduled function.',
    )
    expect(spy).not.toHaveBeenCalled()
  })

  test('Should call validate() for each route returned from read()', async () => {
    const mockValidate = vi.fn(async () => [])
    vi.doMock('../../../src/api/routes/read', () => ({
      default: async () => ROUTES,
    }))
    vi.doMock('../../../src/api/routes/validate', () => ({
      default: mockValidate,
    }))
    const { default: display } = await import(
      '../../../src/api/routes/display.js'
    )
    await display(console, CWD)
    expect(mockValidate).toBeCalledTimes(ROUTES.length)
  })

  test('Should log the table and reject if errors are return from validate()', async () => {
    const spy = vi.spyOn(console, 'log')
    vi.doMock('../../../src/api/routes/read', () => ({
      default: async () => ROUTES,
    }))
    vi.doMock('../../../src/api/routes/validate', () => ({
      default: async () => ['error1', 'error2'],
    }))

    const { default: display } = await import(
      '../../../src/api/routes/display.js'
    )
    const promise = display(console, CWD)
    await expect(promise).rejects.toThrow(
      '3 of 3 route configurations are invalid.',
    )
    expect(spy).toHaveBeenCalled()
  })
})
