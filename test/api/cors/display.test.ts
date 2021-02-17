import { APITypes } from '@oneblink/types'

describe('cors display', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  const CWD = 'current working directory'
  const CORS: APITypes.APIEnvironmentCorsConfiguration = {
    origins: ['http://test'],
    headers: ['Accept', 'Content-Type'],
    exposedHeaders: ['Accept', 'Content-Type'],
  }

  beforeEach(() => {
    jest.mock('api/cors/read', () => {
      return () => Promise.resolve(CORS)
    })
    jest.mock('api/cors/validate', () => {
      return () => Promise.resolve(CORS)
    })
  })

  test('Should call read() with correct input', async () => {
    expect.assertions(1)
    jest.mock('api/cors/read', () => {
      return async (cwd: string) => {
        expect(cwd).toBe(CWD)
        return CORS
      }
    })

    const { default: display } = await import('../../../src/api/cors/display')
    return display(console, CWD)
  })

  test('Should not log or validate if read() does not return cors', async () => {
    expect.assertions(1)
    jest.mock('api/cors/read', () => {
      return async () => {
        return
      }
    })
    jest.mock('api/cors/validate', () => {
      return async () => {
        fail('Should not validate')
        return CORS
      }
    })
    const spy = jest.spyOn(console, 'log')

    const { default: display } = await import('../../../src/api/cors/display')
    await display(console, CWD)

    expect(spy).not.toHaveBeenCalled()
  })

  test('Should call validate() with correct input', async () => {
    jest.mock('api/cors/validate', () => {
      return async (cors: APITypes.APIEnvironmentCorsConfiguration) => {
        expect(cors).toEqual(CORS)
        return cors
      }
    })

    const { default: display } = await import('../../../src/api/cors/display')
    return display(console, CWD)
  })

  test('Should not log the cors and reject if no routes are found', async () => {
    jest.mock('api/cors/validate', () => {
      return async () => {
        throw new Error('test error message')
      }
    })

    const spy = jest.spyOn(console, 'log')

    const { default: display } = await import('../../../src/api/cors/display')
    const promise = display(console, CWD)

    await expect(promise).rejects.toHaveProperty(
      'message',
      'test error message',
    )

    expect(spy).not.toHaveBeenCalled()
  })

  test('Should log the cors', async () => {
    const spy = jest.spyOn(console, 'log')

    const { default: display } = await import('../../../src/api/cors/display')
    await display(console, CWD)

    expect(spy).toHaveBeenCalled()
  })
})
