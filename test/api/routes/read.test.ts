describe('read', () => {
  const CWD = 'current working directory'
  const CONFIGURATION_ROUTES = [{ route: 'configuration routes' }]
  const PROJECT_ROUTES = [{ route: 'project routes' }]

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('Should use configuration routes if available', async () => {
    const mockScopeRead = jest.fn()
    mockScopeRead.mockResolvedValue({
      routes: CONFIGURATION_ROUTES,
    })
    jest.mock('api/scope', () => ({
      read: mockScopeRead,
    }))

    const mockListRoutes = jest.fn()
    mockListRoutes.mockResolvedValue(PROJECT_ROUTES)
    jest.mock('api/listDirectoryRoutes', () => mockListRoutes)
    const { default: read } = await import('../../../src/api/routes/read')

    const routes = await read(CWD)
    expect(routes).toEqual(CONFIGURATION_ROUTES)
    expect(mockScopeRead).toBeCalledWith(CWD)
    expect(mockListRoutes).not.toBeCalled()
  })

  test('Should use project routes if configuration routes are unavailable', async () => {
    jest.mock('api/scope', () => ({
      read: async () => ({}),
    }))
    const mockListRoutes = jest.fn()
    mockListRoutes.mockResolvedValue(PROJECT_ROUTES)
    jest.mock('api/listDirectoryRoutes', () => mockListRoutes)
    const { default: read } = await import('../../../src/api/routes/read')

    const routes = await read(CWD)
    expect(routes).toEqual(PROJECT_ROUTES)
    expect(mockListRoutes).toBeCalled()
  })

  test('Should not reject and should always return an array if no routes are found', async () => {
    jest.mock('api/scope', () => ({
      read: async () => ({
        routes: [],
      }),
    }))
    jest.mock('api/listDirectoryRoutes', () => async () => [])
    const { default: read } = await import('../../../src/api/routes/read')

    const routes = await read(CWD)
    expect(routes).toEqual([])
  })

  test('Timeouts should be set via priority default, project, route', async () => {
    jest.mock('api/scope', () => ({
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
