import { describe, expect, test, jest } from '@jest/globals'

describe('verify-jwt', () => {
  const JWT = 'a valid jwt'
  const DECODED = {
    exp: Date.now() / 1000 + 43200, // 12 hours after tests are run
  }

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('verifyJWT() should return a jwt and call decode', async () => {
    const mockDecode = jest.fn().mockReturnValue(DECODED)
    jest.unstable_mockModule('jsonwebtoken', () => ({
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
    jest.unstable_mockModule('jsonwebtoken', () => ({
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
    jest.unstable_mockModule('jsonwebtoken', () => ({
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
