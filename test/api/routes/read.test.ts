import { afterEach, describe, expect, test, vi } from 'vitest'

describe('read', () => {
  const CWD = 'current working directory'
  const CONFIGURATION_ROUTES = [{ route: 'configuration routes' }]
  const PROJECT_ROUTES = [{ route: 'project routes' }]

  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  test('Should use configuration routes if available', async () => {
    const mockScopeRead = vi.fn(async () => ({
      routes: CONFIGURATION_ROUTES,
    }))
    vi.doMock('../../../src/api/scope', () => ({
      default: {
        read: mockScopeRead,
      },
    }))

    const mockListRoutes = vi.fn(async () => PROJECT_ROUTES)
    vi.doMock('../../../src/api/listDirectoryRoutes', () => ({
      default: mockListRoutes,
    }))
    const { default: read } = await import('../../../src/api/routes/read')

    const routes = await read(CWD)
    expect(routes).toEqual(CONFIGURATION_ROUTES)
    expect(mockScopeRead).toBeCalledWith(CWD)
    expect(mockListRoutes).not.toBeCalled()
  })

  test('Should use project routes if configuration routes are unavailable', async () => {
    vi.doMock('../../../src/api/scope', () => ({
      default: {
        read: async () => ({}),
      },
    }))
    const mockListRoutes = vi.fn(async () => PROJECT_ROUTES)
    vi.doMock('../../../src/api/listDirectoryRoutes', () => ({
      default: mockListRoutes,
    }))
    const { default: read } = await import('../../../src/api/routes/read')

    const routes = await read(CWD)
    expect(routes).toEqual(PROJECT_ROUTES)
    expect(mockListRoutes).toBeCalled()
  })

  test('Should not reject and should always return an array if no routes are found', async () => {
    vi.doMock('../../../src/api/scope', () => ({
      default: {
        read: async () => ({
          routes: [],
        }),
      },
    }))
    vi.doMock('../../../src/api/listDirectoryRoutes', () => ({
      default: async () => [],
    }))
    const { default: read } = await import('../../../src/api/routes/read')

    const routes = await read(CWD)
    expect(routes).toEqual([])
  })

  test('Timeouts should be set via priority default, project, route', async () => {
    vi.doMock('../../../src/api/scope', () => ({
      default: {
        read: async () => ({
          timeout: 20,
          routes: [
            {
              route: 'config timeout',
            },
            {
              route: 'route timeout',
              timeout: 25,
            },
          ],
        }),
      },
    }))
    const { default: read } = await import('../../../src/api/routes/read')

    const routes = await read(CWD)
    expect(routes).toEqual([
      {
        route: 'config timeout',
        timeout: 20,
      },
      {
        route: 'route timeout',
        timeout: 25,
      },
    ])
  })
})
