import querystring from 'querystring'

import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'

import pkg from './package.js'
import verifyJWT from './identity/utils/verify-jwt.js'
import getJWT from './identity/utils/get-jwt.js'

const userAgent = `Node.js ${pkg.name} / ${pkg.version}`

async function getBearerToken(): Promise<string> {
  let key
  let secret
  // Keeping BLINKM_* variables for backward compatibility
  // with the old Server CLI and Client CLI
  if (process.env.BLINKM_ACCESS_KEY && process.env.BLINKM_SECRET_KEY) {
    key = process.env.BLINKM_ACCESS_KEY
    secret = process.env.BLINKM_SECRET_KEY
  }
  if (process.env.ONEBLINK_ACCESS_KEY && process.env.ONEBLINK_SECRET_KEY) {
    key = process.env.ONEBLINK_ACCESS_KEY
    secret = process.env.ONEBLINK_SECRET_KEY
  }
  if (key && secret) {
    const expiryInMS = Date.now() + 1000 * 60 * 15 // expires in 15 minutes
    return Promise.resolve(
      jwt.sign(
        {
          iss: key,
          exp: Math.floor(expiryInMS / 1000), // exp claim should be in seconds, not milliseconds
        },
        secret,
      ),
    )
  }
  const token = await getJWT()
  return verifyJWT(token)
}

export default class OneBlinkAPIClient {
  tenant: Tenant

  constructor(tenant: Tenant) {
    this.tenant = tenant
  }

  async getRequest<TOut>(path: string): Promise<TOut> {
    const accessToken = await getBearerToken()
    const response = await fetch(`${this.tenant.origin}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
      },
    })

    const payload = (await response.json()) as TOut
    if (!response.ok) {
      throw new Error(
        (payload as { message?: string }).message ||
          'Unknown error, please try again and contact support if the problem persists',
      )
    }

    return payload
  }

  async searchRequest<T, TOut>(
    path: string,
    searchParams: T | void,
  ): Promise<TOut> {
    const search = querystring.stringify(searchParams || {})

    return this.getRequest(`${path}?${search}`)
  }

  async postRequest<T, TOut>(path: string, body: T | void): Promise<TOut> {
    const accessToken = await getBearerToken()
    const response = await fetch(`${this.tenant.origin}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
      },
      body: JSON.stringify(body),
    })

    const payload = (await response.json()) as TOut
    if (!response.ok) {
      throw new Error(
        (payload as { message?: string }).message ||
          'Unknown error, please try again and contact support if the problem persists',
      )
    }

    return payload
  }

  async deleteRequest(path: string): Promise<void> {
    const accessToken = await getBearerToken()
    const response = await fetch(`${this.tenant.origin}${path}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
      },
    })
    if (!response.ok) {
      const payload = await response.json()
      throw new Error(
        (payload as { message?: string }).message ||
          'Unknown error, please try again and contact support if the problem persists',
      )
    }
  }
}
