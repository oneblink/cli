describe('get-route-config', () => {
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

  test('should return route config', async () => {
    jest.mock('api/routes/read', () => async () => ROUTES)

    const { default: getRouteConfig } = await import(
      '../../../src/api/routes/get-route-config'
    )

    const routeConfig = await getRouteConfig(CWD, '/api/books/:id')
    expect(routeConfig).toEqual(ROUTES[1])
  })

  test('should reject if a project does not contain route', async () => {
    jest.mock('api/routes/read', () => async () => ROUTES)

    const { default: getRouteConfig } = await import(
      '../../../src/api/routes/get-route-config'
    )

    const promise = getRouteConfig(CWD, '/route')
    await expect(promise).rejects.toThrow(
      'Project does not contain route: /route',
    )
  })
})
