import jwt from 'jsonwebtoken'

import login from './common/login'
import logout from './common/logout'
import verifyJWT from './utils/verify-jwt'
import getJWT from './utils/get-jwt'

export default class OneBlinkIdentity {
  async login(tenant: Tenant, options: LoginOptions): Promise<string> {
    return login(tenant, options)
  }

  async logout(tenant: Tenant): Promise<void> {
    return logout(tenant)
  }

  async getAccessToken(): Promise<string> {
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

  async getPayload(accessToken: string | void): Promise<any> {
    const token = accessToken || (await this.getAccessToken())
    return jwt.decode(token)
  }
}

export type LoginOptions = {
  password?: string
  username?: string | true
  storeJwt?: boolean
}

export type UserConfigStore = {
  load: () => Promise<any>
  update: (config: any) => Promise<any>
}
