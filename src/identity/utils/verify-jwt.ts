import jsonwebtoken from 'jsonwebtoken'

function isExpired(date: Date): boolean {
  if (!date) {
    return true
  }
  return date.getTime() < Date.now()
}

export default async function verifyJWT(jwt: string | void): Promise<string> {
  if (!jwt) {
    throw new Error('Unauthenticated, please login before using this service.')
  }

  const decoded = jsonwebtoken.decode(jwt)
  if (!decoded || typeof decoded === 'string' || !decoded.exp) {
    throw new Error('Malformed access token. Please login again.')
  }

  // The 0 here is the key, which sets the date to the epoch
  const expiryDate = new Date(0)
  expiryDate.setUTCSeconds(decoded.exp)

  // If token has not yet expired we can continue
  if (isExpired(expiryDate)) {
    throw new Error(
      'Unauthorised, your access token has expired. Please login again.',
    )
  }

  return jwt
}
