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
    const mockRead = jest.fn()
    mockRead.mockResolvedValue(ROUTES)
    jest.mock('api/routes/read', () => mockRead)
    jest.mock('api/routes/validate', () => async () => [])
    const { default: display } = await import('../../../src/api/routes/display')
    await display(console, CWD)
    expect(mockRead).toBeCalledWith(CWD)
    expect(spy).toBeCalled()
  })

  test('Should log the routes and reject if no routes are found', async () => {
    const spy = jest.spyOn(console, 'log')
    jest.mock('api/routes/read', () => async () => [])

    const { default: display } = await import('../../../src/api/routes/display')
    const promise = display(console, CWD)
    await expect(promise).rejects.toThrow(
      'No routes found, see documentation for information on how to create routes.',
    )
    expect(spy).not.toHaveBeenCalled()
  })

  test('Should call validate() for each route returned from read()', async () => {
    const mockValidate = jest.fn()
    mockValidate.mockResolvedValue([])
    jest.mock('api/routes/read', () => async () => ROUTES)
    jest.mock('api/routes/validate', () => mockValidate)
    const { default: display } = await import('../../../src/api/routes/display')
    await display(console, CWD)
    expect(mockValidate).toBeCalledTimes(ROUTES.length)
  })

  test('Should log the table and reject if errors are return from validate()', async () => {
    const spy = jest.spyOn(console, 'log')
    jest.mock('api/routes/read', () => async () => ROUTES)
    jest.mock('api/routes/validate', () => async () => ['error1', 'error2'])

    const { default: display } = await import('../../../src/api/routes/display')
    const promise = display(console, CWD)
    await expect(promise).rejects.toThrow(
      '3 of 3 route configurations are invalid.',
    )
    expect(spy).toHaveBeenCalled()
  })
})
