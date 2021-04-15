import querystring from 'querystring'

import constants from '../../../src/identity/constants'
import { TENANTS } from '../../../src/config'

describe('', () => {
  const JWT = 'valid jwt'
  const CODE = 'abc123'
  const VERIFIER_CHALLENGE = 'verifier challenge'

  const importBrowserLoginProvider = async () => {
    const { default: BrowserLoginProvider } = await import(
      '../../../src/identity/login-providers/browser'
    )
    return new BrowserLoginProvider(TENANTS.ONEBLINK)
  }

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  beforeEach(() => {
    jest.mock('open', () => () => undefined)
    jest.mock('inquirer', () => ({
      prompt: async () => ({
        code: CODE,
      }),
    }))
  })

  test('login() should work', async () => {
    jest.mock('base64url', () => ({
      encode: () => VERIFIER_CHALLENGE,
    }))
    const mockOpen = jest.fn()
    jest.mock('open', () => mockOpen)
    const mockPrompt = jest.fn()
    mockPrompt.mockResolvedValue({
      code: CODE,
    })
    jest.mock('inquirer', () => ({
      prompt: mockPrompt,
    }))
    const mockNodeFetch = jest.fn()
    mockNodeFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id_token: JWT }),
    })
    jest.mock('node-fetch', () => mockNodeFetch)
    const spy = jest.spyOn(console, 'log')

    const browserLoginProvider = await importBrowserLoginProvider()

    const jwt = await browserLoginProvider.login(false)
    // should return valid jwt
    expect(jwt).toBe(JWT)

    // should call opn with correct data in url
    expect(mockOpen).toBeCalled()
    const openUrl = mockOpen.mock.calls[0][0]
    const openSearch = querystring.stringify({
      response_type: 'code',
      scope: constants.SCOPE,
      client_id: TENANTS.ONEBLINK.loginClientId,
      redirect_uri: TENANTS.ONEBLINK.loginCallbackUrl,
      code_challenge: VERIFIER_CHALLENGE,
      code_challenge_method: 'S256',
    })
    expect(openUrl).toBe(`${TENANTS.ONEBLINK.loginUrl}/authorize?${openSearch}`)
    const openOptions = mockOpen.mock.calls[0][1]
    expect(openOptions).toEqual({
      wait: false,
    })

    // should make POST request with the correct url and data
    expect(mockNodeFetch).toBeCalled()
    const nodeFetchUrl = mockNodeFetch.mock.calls[0][0]
    expect(nodeFetchUrl).toBe(`${TENANTS.ONEBLINK.loginUrl}/oauth2/token`)
    const nodeFetchOptions = mockNodeFetch.mock.calls[0][1]
    expect(nodeFetchOptions.body.get('code')).toBe(CODE)
    expect(nodeFetchOptions.body.get('code_verifier')).toBe(VERIFIER_CHALLENGE)
    expect(nodeFetchOptions.body.get('client_id')).toBe(
      TENANTS.ONEBLINK.loginClientId,
    )
    expect(nodeFetchOptions.body.get('grant_type')).toBe('authorization_code')
    expect(nodeFetchOptions.body.get('redirect_uri')).toBe(
      TENANTS.ONEBLINK.loginCallbackUrl,
    )

    // should log a message to the console
    expect(spy).toBeCalledWith(
      'A browser has been opened to allow you to login. Once logged in, you will be granted a verification code.',
    )

    // should prompt with the correct question
    expect(mockPrompt).toBeCalledWith([
      {
        type: 'input',
        name: 'code',
        message: 'Please enter the code: ',
      },
    ])
  })

  test('login() should should reject if request returns an error', async () => {
    jest.mock('node-fetch', () => async () => {
      throw new Error('Test error message')
    })

    const browserLoginProvider = await importBrowserLoginProvider()

    const promise = browserLoginProvider.login(false)

    await expect(promise).rejects.toThrow('Test error message')
  })

  test('login() should should reject if request returns an error', async () => {
    jest.mock('node-fetch', () => async () => ({
      ok: false,
      json: async () => ({
        error: 'error code',
        error_description: 'test error message',
      }),
    }))

    const browserLoginProvider = await importBrowserLoginProvider()

    const promise = browserLoginProvider.login(false)

    await expect(promise).rejects.toThrow('test error message')
  })
})
