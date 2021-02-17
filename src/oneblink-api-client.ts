import querystring from 'querystring'

import fetch from 'node-fetch'

import pkg from './package'
import OneBlinkIdentity from './identity'

const userAgent = `Node.js ${pkg.name} / ${pkg.version}`

export default class OneBlinkAPIClient {
  tenant: Tenant
  oneBlinkIdentity: OneBlinkIdentity

  constructor(tenant: Tenant) {
    this.tenant = tenant
    this.oneBlinkIdentity = new OneBlinkIdentity()
  }

  async getRequest<TOut>(path: string): Promise<TOut> {
    const accessToken = await this.oneBlinkIdentity.getAccessToken()
    const response = await fetch(`${this.tenant.origin}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
      },
    })

    const payload = await response.json()
    if (!response.ok) {
      throw new Error(
        payload.message ||
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
    const accessToken = await this.oneBlinkIdentity.getAccessToken()
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

    const payload = await response.json()
    if (!response.ok) {
      throw new Error(
        payload.message ||
          'Unknown error, please try again and contact support if the problem persists',
      )
    }

    return payload
  }

  async deleteRequest(path: string): Promise<void> {
    const accessToken = await this.oneBlinkIdentity.getAccessToken()
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
        payload.message ||
          'Unknown error, please try again and contact support if the problem persists',
      )
    }
  }
}
