import { afterEach, describe, expect, test, vi } from 'vitest'

import { TENANTS } from '../../../src/config.js'

describe('login', () => {
  const JWT = 'valid jwt'

  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  test('login() should create a BrowserLoginProvider if no options are passed', async () => {
    const mockBrowserLogin = vi.fn(async () => JWT)
    vi.doMock('../../../src/identity/login-providers/browser', () => ({
      default: class {
        login = mockBrowserLogin
      },
    }))

    const { default: login } = await import(
      '../../../src/identity/common/login.js'
    )

    await login(TENANTS.ONEBLINK)
    expect(mockBrowserLogin).toBeCalledWith(true)
  })
})
