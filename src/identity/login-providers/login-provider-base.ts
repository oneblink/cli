import userConfig from '../utils/user-config.js'

/**
 * Base class representing a login provider.
 */
export default class LoginProviderBase {
  CONSTANTS: Tenant

  constructor(tenant: Tenant) {
    this.CONSTANTS = tenant
  }

  /**
   * Store the JWT generated after a successful login for later use.
   * @param {String} jwt - The JWT generated after a successful login.
   * @returns {String} The JWT generated after a successful login.
   */
  async storeJWT(body: {
    id_token: string
    access_token: string
    refresh_token: string
  }): Promise<void> {
    await userConfig.getStore().update((config: any) => {
      // Setting accessToken as well as id_token to be backward compatible
      config.accessToken = body.id_token
      config.id_token = body.id_token
      config.access_token = body.access_token
      config.refresh_token = body.refresh_token
      return config
    })
  }
}
