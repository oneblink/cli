import { afterEach, describe, expect, test, vi } from 'vitest'

import { TENANTS } from '../../../src/config.js'

describe('logout', () => {
  const JWT = 'valid jwt'

  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  test('logout() should reject if a request returns an error', async () => {
    global.fetch = async () => {
      throw new Error('Test error message')
    }

    const { default: logout } =
      await import('../../../src/identity/common/logout.js')
    const promise = logout(TENANTS.ONEBLINK)
    await expect(promise).rejects.toThrow('Test error message')
  })

  test('logout() should call userConfigStore.update() to update and remove access token', async () => {
    global.fetch = async () => new Response()
    const mockUpdate = vi.fn(async () => ({}))
    vi.doMock('../../../src/blinkmrc.js', () => ({
      userConfig: () => ({
        load: async () => ({
          accessToken: JWT,
        }),
        update: mockUpdate,
      }),
    }))

    const { default: logout } =
      await import('../../../src/identity/common/logout.js')

    await logout(TENANTS.ONEBLINK)
    expect(mockUpdate).toBeCalled()
  })
})
