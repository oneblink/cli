import { describe, expect, test, jest } from '@jest/globals'
import { APITypes } from '@oneblink/types'

describe('cors display', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  const CWD = 'current working directory'
  const CORS: APITypes.APIEnvironmentCorsConfiguration = {
    // eslint-disable-next-line @microsoft/sdl/no-insecure-url
    origins: ['http://test'],
    headers: ['Accept', 'Content-Type'],
    exposedHeaders: ['Accept', 'Content-Type'],
  }

  beforeEach(() => {
    jest.unstable_mockModule('api/cors/read', () => ({
      default: () => Promise.resolve(CORS),
    }))
    jest.unstable_mockModule('api/cors/validate', () => ({
      default: () => Promise.resolve(CORS),
    }))
  })

  test('Should call read() with correct input', async () => {
    expect.assertions(1)
    jest.unstable_mockModule('api/cors/read', () => ({
      default: async (cwd: string) => {
        expect(cwd).toBe(CWD)
        return CORS
      },
    }))

    const { default: display } = await import('../../../src/api/cors/display.js')
    return display(console, CWD)
  })

  test('Should not log or validate if read() does not return cors', async () => {
    expect.assertions(1)
    jest.unstable_mockModule('api/cors/read', () => {
      return {
        default: async () => {
          return
        },
      }
    })
    jest.unstable_mockModule('api/cors/validate', () => {
      return {
        default: async () => {
          fail('Should not validate')
        },
      }
    })
    const spy = jest.spyOn(console, 'log')

    const { default: display } = await import('../../../src/api/cors/display.js')
    await display(console, CWD)

    expect(spy).not.toHaveBeenCalled()
  })

  test('Should call validate() with correct input', async () => {
    jest.unstable_mockModule('api/cors/validate', () => {
      return {
        default: async (cors: APITypes.APIEnvironmentCorsConfiguration) => {
          expect(cors).toEqual(CORS)
          return cors
        },
      }
    })

    const { default: display } = await import('../../../src/api/cors/display.js')
    return display(console, CWD)
  })

  test('Should not log the cors and reject if no routes are found', async () => {
    jest.unstable_mockModule('api/cors/validate', () => {
      return {
        default: async () => {
          throw new Error('test error message')
        },
      }
    })

    const spy = jest.spyOn(console, 'log')

    const { default: display } = await import('../../../src/api/cors/display.js')
    const promise = display(console, CWD)

    await expect(promise).rejects.toHaveProperty(
      'message',
      'test error message',
    )

    expect(spy).not.toHaveBeenCalled()
  })

  test('Should log the cors', async () => {
    const spy = jest.spyOn(console, 'log')

    const { default: display } = await import('../../../src/api/cors/display.js')
    await display(console, CWD)

    expect(spy).toHaveBeenCalled()
  })
})
