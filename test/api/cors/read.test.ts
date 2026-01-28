import { afterEach, describe, expect, test, vi } from 'vitest'
import values from '../../../src/api/values.js'

describe('read', () => {
  const CWD = 'current working directory'

  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  test('Should return the defaults if cors is true', async () => {
    vi.doMock('../../../src/blinkmrc.js', () => ({
      projectConfig: () => ({
        load: async () => ({
          server: {
            cors: true,
          },
        }),
        update: async () => ({}),
      }),
    }))
    const { default: read } = await import('../../../src/api/cors/read.js')

    const cors = await read(CWD)
    expect(cors).toEqual({
      credentials: values.DEFAULT_CORS.CREDENTIALS,
      exposedHeaders: values.DEFAULT_CORS.EXPOSED_HEADERS,
      headers: values.DEFAULT_CORS.HEADERS,
      maxAge: values.DEFAULT_CORS.MAX_AGE,
      origins: values.DEFAULT_CORS.ORIGINS,
    })
  })

  test('Should return false for uninitialized config file', async () => {
    vi.doMock('../../../src/blinkmrc.js', () => ({
      projectConfig: () => ({
        load: async () => ({
          test: 123,
        }),
        update: async () => ({}),
      }),
    }))
    const { default: read } = await import('../../../src/api/cors/read.js')

    const cors = await read(CWD)
    expect(cors).toBe(false)
  })

  test('Should return the currently set cors merged with defaults', async () => {
    vi.doMock('../../../src/blinkmrc.js', () => ({
      projectConfig: () => ({
        load: async () => ({
          server: {
            cors: {
              headers: undefined,
              origins: ['test'],
            },
          },
        }),
        update: async () => ({}),
      }),
    }))
    const { default: read } = await import('../../../src/api/cors/read.js')

    const cors = await read(CWD)
    expect(cors).toEqual({
      credentials: values.DEFAULT_CORS.CREDENTIALS,
      exposedHeaders: values.DEFAULT_CORS.EXPOSED_HEADERS,
      headers: undefined,
      maxAge: values.DEFAULT_CORS.MAX_AGE,
      origins: ['test'],
    })
  })
})
