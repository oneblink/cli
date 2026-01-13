import { describe, expect, test, vi, afterEach, beforeEach } from 'vitest'
import { APITypes } from '@oneblink/types'

describe('cors display', () => {
  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  const CWD = 'current working directory'
  const CORS: APITypes.APIEnvironmentCorsConfiguration = {
    // eslint-disable-next-line @microsoft/sdl/no-insecure-url
    origins: ['http://test'],
    headers: ['Accept', 'Content-Type'],
    exposedHeaders: ['Accept', 'Content-Type'],
  }

  beforeEach(() => {
    vi.doMock('../../../src/api/cors/read', () => ({
      default: () => Promise.resolve(CORS),
    }))
    vi.doMock('../../../src/api/cors/validate', () => ({
      default: () => Promise.resolve(CORS),
    }))
  })

  test('Should call read() with correct input', async () => {
    expect.assertions(1)
    vi.doMock('../../../src/api/cors/read', () => ({
      default: async (cwd: string) => {
        expect(cwd).toBe(CWD)
        return CORS
      },
    }))

    const { default: display } = await import(
      '../../../src/api/cors/display.js'
    )
    return display(console, CWD)
  })

  test('Should not log or validate if read() does not return cors', async () => {
    expect.assertions(1)
    vi.doMock('../../../src/api/cors/read', () => {
      return {
        default: async () => {
          return
        },
      }
    })
    vi.doMock('../../../src/api/cors/validate', () => {
      return {
        default: async () => {
          throw new Error('Should not validate')
        },
      }
    })
    const spy = vi.spyOn(console, 'log')

    const { default: display } = await import(
      '../../../src/api/cors/display.js'
    )
    await display(console, CWD)

    expect(spy).not.toHaveBeenCalled()
  })

  test('Should call validate() with correct input', async () => {
    vi.doMock('../../../src/api/cors/validate', () => {
      return {
        default: async (cors: APITypes.APIEnvironmentCorsConfiguration) => {
          expect(cors).toEqual(CORS)
          return cors
        },
      }
    })

    const { default: display } = await import(
      '../../../src/api/cors/display.js'
    )
    return display(console, CWD)
  })

  test('Should not log the cors and reject if no routes are found', async () => {
    vi.doMock('../../../src/api/cors/validate', () => {
      return {
        default: async () => {
          throw new Error('test error message')
        },
      }
    })

    const spy = vi.spyOn(console, 'log')

    const { default: display } = await import(
      '../../../src/api/cors/display.js'
    )
    const promise = display(console, CWD)

    await expect(promise).rejects.toHaveProperty(
      'message',
      'test error message',
    )

    expect(spy).not.toHaveBeenCalled()
  })

  test('Should log the cors', async () => {
    const spy = vi.spyOn(console, 'log')

    const { default: display } = await import(
      '../../../src/api/cors/display.js'
    )
    await display(console, CWD)

    expect(spy).toHaveBeenCalled()
  })
})
