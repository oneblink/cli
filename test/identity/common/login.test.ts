import { TENANTS } from '../../../src/config'

describe('login', () => {
  const JWT = 'valid jwt'

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('login() should create a BrowserLoginProvider if no options are passed', async () => {
    const mockBrowserLogin = jest.fn()
    mockBrowserLogin.mockResolvedValue(JWT)
    jest.mock(
      '../../../src/identity/login-providers/browser',
      () =>
        class {
          login = mockBrowserLogin
        },
    )

    const { default: login } = await import(
      '../../../src/identity/common/login'
    )

    await login(TENANTS.ONEBLINK)
    expect(mockBrowserLogin).toBeCalledWith(true)
  })
})
