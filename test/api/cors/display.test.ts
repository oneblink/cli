import { describe, expect, test, vi, afterEach } from 'vitest'
import { APITypes } from '@oneblink/types'

describe('cors display', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.resetModules()
  })

  const CWD = 'current working directory'
  const CORS: APITypes.APIEnvironmentCorsConfiguration = {
    // eslint-disable-next-line @microsoft/sdl/no-insecure-url
    origins: ['http://test'],
    headers: ['Accept', 'Content-Type'],
    exposedHeaders: ['Accept', 'Content-Type'],
  }

  async function importDisplay() {
    vi.resetModules()
    return import('../../../src/api/cors/display.js')
  }

  test('Should call read() with correct input', async () => {
    expect.assertions(1)
    vi.doMock('../../../src/api/cors/read.js', () => ({
      default: async (cwd: string) => {
        expect(cwd).toBe(CWD)
        return CORS
      },
    }))
    vi.doMock('../../../src/api/cors/validate.js', () => ({
      default: () => Promise.resolve(CORS),
    }))

    const { default: display } = await importDisplay()
    return display(console, CWD)
  })

  test('Should not log or validate if read() does not return cors', async () => {
    expect.assertions(1)
    vi.doMock('../../../src/api/cors/read.js', () => ({
      default: async () => undefined,
    }))
    vi.doMock('../../../src/api/cors/validate.js', () => ({
      default: async () => {
        throw new Error('Should not validate')
      },
    }))
    const spy = vi.spyOn(console, 'log')

    const { default: display } = await importDisplay()
    await display(console, CWD)

    expect(spy).not.toHaveBeenCalled()
  })

  test('Should call validate() with correct input', async () => {
    vi.doMock('../../../src/api/cors/read.js', () => ({
      default: () => Promise.resolve(CORS),
    }))
    vi.doMock('../../../src/api/cors/validate.js', () => ({
      default: async (cors: APITypes.APIEnvironmentCorsConfiguration) => {
        expect(cors).toEqual(CORS)
        return cors
      },
    }))

    const { default: display } = await importDisplay()
    return display(console, CWD)
  })

  test('Should not log the cors and reject if no routes are found', async () => {
    vi.doMock('../../../src/api/cors/read.js', () => ({
      default: () => Promise.resolve(CORS),
    }))
    vi.doMock('../../../src/api/cors/validate.js', () => ({
      default: async () => {
        throw new Error('test error message')
      },
    }))

    const spy = vi.spyOn(console, 'log')

    const { default: display } = await importDisplay()
    const promise = display(console, CWD)

    await expect(promise).rejects.toHaveProperty(
      'message',
      'test error message',
    )

    expect(spy).not.toHaveBeenCalled()
  })

  test('Should log the cors', async () => {
    vi.doMock('../../../src/api/cors/read.js', () => ({
      default: () => Promise.resolve(CORS),
    }))
    vi.doMock('../../../src/api/cors/validate.js', () => ({
      default: () => Promise.resolve(CORS),
    }))

    const spy = vi.spyOn(console, 'log')

    const { default: display } = await importDisplay()
    await display(console, CWD)

    expect(spy).toHaveBeenCalled()
  })
})
