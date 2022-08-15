import { describe, expect, test, jest } from '@jest/globals'

import { TENANTS } from '../../../src/config.js'

describe('login', () => {
  const JWT = 'valid jwt'

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('login() should create a BrowserLoginProvider if no options are passed', async () => {
    const mockBrowserLogin = jest.fn(async () => JWT)
    jest.unstable_mockModule(
      '../../../src/identity/login-providers/browser',
      () => ({
        default: class {
          login = mockBrowserLogin
        },
      }),
    )

    const { default: login } = await import(
      '../../../src/identity/common/login.js'
    )

    await login(TENANTS.ONEBLINK)
    expect(mockBrowserLogin).toBeCalledWith(true)
  })
})
