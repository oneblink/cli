import { describe, expect, test, jest } from '@jest/globals'

import { TENANTS } from '../../../src/config.js'

describe('logout', () => {
  const JWT = 'valid jwt'

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('logout() should reject if a request returns an error', async () => {
    jest.unstable_mockModule('node-fetch', () => ({
      default: async () => {
        throw new Error('Test error message')
      },
    }))

    const { default: logout } = await import(
      '../../../src/identity/common/logout.js'
    )
    const promise = logout(TENANTS.ONEBLINK)
    await expect(promise).rejects.toThrow('Test error message')
  })

  test('logout() should call userConfigStore.update() to update and remove access token', async () => {
    jest.unstable_mockModule('node-fetch', () => ({
      default: async () => undefined,
    }))
    const mockUpdate = jest.fn(async () => ({}))
    jest.unstable_mockModule('../../../src/blinkmrc.js', () => ({
      userConfig: () => ({
        load: async () => ({
          accessToken: JWT,
        }),
        update: mockUpdate,
      }),
    }))

    const { default: logout } = await import(
      '../../../src/identity/common/logout.js'
    )

    await logout(TENANTS.ONEBLINK)
    expect(mockUpdate).toBeCalled()
  })
})
