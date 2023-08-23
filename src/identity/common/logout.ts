import fetch from 'node-fetch'

import userConfig from '../utils/user-config.js'

export default async function logout(tenant: Tenant): Promise<void> {
  await fetch(`${tenant.loginUrl}/logout?client_id=${tenant.loginClientId}`)

  await userConfig.getStore().update((config) => {
    // Removing accessToken as well as id_token to be backward compatible
    config.accessToken = undefined
    config.access_token = undefined
    config.id_token = undefined
    config.refresh_token = undefined
    return config
  })
}
