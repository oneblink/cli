import fetch from 'node-fetch'

import userConfig from '../utils/user-config.js'
import { USER_AGENT } from '../../config.js'

export default async function logout(tenant: Tenant): Promise<void> {
  await fetch(`${tenant.loginUrl}/logout?client_id=${tenant.loginClientId}`, {
    headers: {
      'User-Agent': USER_AGENT,
    },
  })

  await userConfig.getStore().update((config) => {
    // Removing accessToken as well as id_token to be backward compatible
    config.accessToken = undefined
    config.access_token = undefined
    config.id_token = undefined
    config.refresh_token = undefined
    return config
  })
}
