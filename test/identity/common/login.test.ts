import { TENANTS } from '../../../src/config'
import { LoginOptions } from '../../../src/identity'

describe('login', () => {
  const JWT = 'valid jwt'

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('login() should create a UsernameLoginProvider if all options are passed', async () => {
    const mockUsernameLogin = jest.fn()
    mockUsernameLogin.mockResolvedValue(JWT)
    jest.mock(
      '../../../src/identity/login-providers/username',
      () =>
        class {
          login = mockUsernameLogin
        },
    )

    const { default: login } = await import(
      '../../../src/identity/common/login'
    )
    const options = {
      username: 'test',
      password: 'pass',
    }

    await login(TENANTS.ONEBLINK, options)
    expect(mockUsernameLogin).toBeCalledWith(
      options.username,
      options.password,
      undefined,
    )
  })

  test('login() should create a usernameLoginProvider and call login() with null if username is passed in as true', async () => {
    const mockUsernameLogin = jest.fn()
    mockUsernameLogin.mockResolvedValue(JWT)
    jest.mock(
      '../../../src/identity/login-providers/username',
      () =>
        class {
          login = mockUsernameLogin
        },
    )
    const { default: login } = await import(
      '../../../src/identity/common/login'
    )

    const options: LoginOptions = {
      username: true,
      password: 'pass',
    }
    await login(TENANTS.ONEBLINK, options)
    expect(mockUsernameLogin).toBeCalledWith(null, options.password, undefined)
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

    await login(TENANTS.ONEBLINK, undefined)
    expect(mockBrowserLogin).toBeCalledWith(undefined)
  })
})
