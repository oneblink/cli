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
    jest.mock('jsonwebtoken', () => ({
      decode: mockDecode,
    }))

    const { default: verifyJWT } = await import(
      '../../../src/identity/utils/verify-jwt'
    )
    const jwt = await verifyJWT(JWT)
    expect(jwt).toBe(JWT)
    expect(mockDecode).toBeCalled()
  })

  test('verifyJWT() should reject if a jwt is not passed in', async () => {
    const { default: verifyJWT } = await import(
      '../../../src/identity/utils/verify-jwt'
    )

    const promise = verifyJWT()
    await expect(promise).rejects.toThrow(
      'Unauthenticated, please login before using this service.',
    )
  })

  test('verifyJWT() should reject if decode() does not return an object with an exp property', async () => {
    jest.mock('jsonwebtoken', () => ({
      decode: () => null,
    }))
    const { default: verifyJWT } = await import(
      '../../../src/identity/utils/verify-jwt'
    )
    const promise = verifyJWT(JWT)
    await expect(promise).rejects.toThrow(
      'Malformed access token. Please login again.',
    )
  })

  test('verifyJWT() should reject if jwt is expired', async () => {
    jest.mock('jsonwebtoken', () => ({
      decode: () => ({
        exp: Date.now() / 1000 - 10, // 10 seconds before test is run (expired)
      }),
    }))

    const { default: verifyJWT } = await import(
      '../../../src/identity/utils/verify-jwt'
    )
    const promise = verifyJWT(JWT)
    await expect(promise).rejects.toThrow(
      'Unauthorised, your access token has expired. Please login again.',
    )
  })
})
