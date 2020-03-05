/* @flow */
'use strict'

const request = require('request')

const userConfig = require('../utils/user-config.js')

async function logout(tenant /* : Tenant */) /* : Promise<void> */ {
  await new Promise((resolve, reject) => {
    request.get(
      `${tenant.loginUrl}/logout?client_id=${tenant.loginClientId}`,
      (err, status, body) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      },
    )
  })

  await userConfig.getStore().update(config => {
    // Removing accessToken as well as id_token to be backward compatible
    config.accessToken = undefined
    config.access_token = undefined
    config.id_token = undefined
    config.refresh_token = undefined
    return config
  })
}

module.exports = logout
