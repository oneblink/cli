import { expect, test, vi } from 'vitest'

import { TENANTS } from '../../../src/config.js'

test('storeJWT() should store jwt', async () => {
  vi.doMock('../../../src/blinkmrc.js', () => ({
    userConfig: () => ({
      load: async () => ({}),
      update: async () => ({}),
    }),
  }))

  const { default: LoginProviderBase } = await import(
    '../../../src/identity/login-providers/login-provider-base.js'
  )
  const loginProviderBase = new LoginProviderBase(TENANTS.ONEBLINK)

  const promise = loginProviderBase.storeJWT({
    id_token: 'id_token',
    access_token: 'access_token',
    refresh_token: 'refresh_token',
  })
  await expect(promise).resolves.toBeUndefined()
})
