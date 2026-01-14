import { afterEach, describe, expect, test, vi } from 'vitest'

describe('verify-jwt', () => {
  const JWT = 'a valid jwt'
  const DECODED = {
    exp: Date.now() / 1000 + 43200, // 12 hours after tests are run
  }

  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  test('verifyJWT() should return a jwt and call decode', async () => {
    const mockDecode = vi.fn().mockReturnValue(DECODED)
    vi.doMock('jsonwebtoken', () => ({
      default: {
        decode: mockDecode,
      },
    }))

    const { default: verifyJWT } = await import(
      '../../../src/identity/utils/verify-jwt.js'
    )
    const jwt = await verifyJWT(JWT)
    expect(jwt).toBe(JWT)
    expect(mockDecode).toBeCalled()
  })

  test('verifyJWT() should reject if a jwt is not passed in', async () => {
    const { default: verifyJWT } = await import(
      '../../../src/identity/utils/verify-jwt.js'
    )

    const promise = verifyJWT()
    await expect(promise).rejects.toThrow(
      'Unauthenticated, please login before using this service.',
    )
  })

  test('verifyJWT() should reject if decode() does not return an object with an exp property', async () => {
    vi.doMock('jsonwebtoken', () => ({
      default: {
        decode: () => null,
      },
    }))
    const { default: verifyJWT } = await import(
      '../../../src/identity/utils/verify-jwt.js'
    )
    const promise = verifyJWT(JWT)
    await expect(promise).rejects.toThrow(
      'Malformed access token. Please login again.',
    )
  })

  test('verifyJWT() should reject if jwt is expired', async () => {
    vi.doMock('jsonwebtoken', () => ({
      default: {
        decode: () => ({
          exp: Date.now() / 1000 - 10, // 10 seconds before test is run (expired)
        }),
      },
    }))

    const { default: verifyJWT } = await import(
      '../../../src/identity/utils/verify-jwt.js'
    )
    const promise = verifyJWT(JWT)
    await expect(promise).rejects.toThrow(
      'Unauthorised, your access token has expired. Please login again.',
    )
  })
})
