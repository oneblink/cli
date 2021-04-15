import { TENANTS } from '../../../src/config'

describe('logout', () => {
  const JWT = 'valid jwt'

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('logout() should reject if a request returns an error', async () => {
    jest.mock('node-fetch', () => async () => {
      throw new Error('Test error message')
    })

    const { default: logout } = await import(
      '../../../src/identity/common/logout'
    )
    const promise = logout(TENANTS.ONEBLINK)
    await expect(promise).rejects.toThrow('Test error message')
  })

  test('logout() should call userConfigStore.update() to update and remove access token', async () => {
    jest.mock('node-fetch', () => async () => undefined)
    const mockUpdate = jest.fn()
    mockUpdate.mockResolvedValue({})
    jest.mock('@blinkmobile/blinkmrc', () => ({
      userConfig: () => ({
        load: async () => ({
          accessToken: JWT,
        }),
        update: mockUpdate,
      }),
    }))

    const { default: logout } = await import(
      '../../../src/identity/common/logout'
    )

    await logout(TENANTS.ONEBLINK)
    expect(mockUpdate).toBeCalled()
  })
})
