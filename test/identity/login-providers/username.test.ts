import { TENANTS } from '../../../src/config'

describe('username', () => {
  const JWT = 'valid jwt'
  const USERNAME = 'username'
  const PASSWORD = 'password'

  const importUsernameLoginProvider = async () => {
    const { default: UsernameLoginProvider } = await import(
      '../../../src/identity/login-providers/username'
    )
    return new UsernameLoginProvider(TENANTS.ONEBLINK)
  }

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  beforeEach(() => {
    jest.mock('aws-sdk', () => ({
      CognitoIdentityServiceProvider: class {
        initiateAuth() {
          return {
            promise: async () => ({
              AuthenticationResult: {
                IdToken: JWT,
                AccessToken: 'AccessToken',
                RefreshToken: 'RefreshToken',
              },
            }),
          }
        }
      },
    }))
  })

  test('login() should return valid jwt when username and password are passed in', async () => {
    const usernameLoginProvider = await importUsernameLoginProvider()

    const jwt = await usernameLoginProvider.login(USERNAME, PASSWORD, false)
    expect(jwt).toBe(JWT)
  })

  test('login() should ask for username and password if username and password is not passed in', async () => {
    const mockPrompt = jest.fn()
    mockPrompt.mockResolvedValue({
      username: USERNAME,
      password: PASSWORD,
    })
    jest.mock('inquirer', () => ({
      prompt: mockPrompt,
    }))

    const usernameLoginProvider = await importUsernameLoginProvider()

    await usernameLoginProvider.login(null, undefined, false)
    expect(mockPrompt).toBeCalledWith([
      {
        type: 'input',
        name: 'username',
        message: 'OneBlink Username: ',
      },
      {
        type: 'password',
        name: 'password',
        message: 'OneBlink Password: ',
      },
    ])
  })

  test('login() should should reject if username is not returned from the prompt', async () => {
    jest.mock('inquirer', () => ({
      prompt: async () => ({}),
    }))

    const usernameLoginProvider = await importUsernameLoginProvider()

    const promise = usernameLoginProvider.login(null, undefined, false)
    await expect(promise).rejects.toThrow('Please specify a username.')
  })

  test('login() should should reject if password is not returned from the prompt', async () => {
    jest.mock('inquirer', () => ({
      prompt: async () => ({
        username: USERNAME,
      }),
    }))

    const usernameLoginProvider = await importUsernameLoginProvider()

    const promise = usernameLoginProvider.login(null, undefined, false)
    await expect(promise).rejects.toThrow('Please specify a password.')
  })
})
