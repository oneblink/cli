/* @flow */
'use strict'

/* ::
import type {
  LoginOptions
} from '..'
*/

const UsernameLoginProvider = require('../login-providers/username.js')
const BrowserLoginProvider = require('../login-providers/browser.js')

async function login(
  tenant /* : Tenant */,
  options /* : ?LoginOptions */,
) /* : Promise<string> */ {
  options = options || {}
  if (options.username) {
    const loginProvider = new UsernameLoginProvider(tenant)
    return loginProvider.login(
      options.username === true ? null : options.username,
      options.password,
      options.storeJwt,
    )
  } else {
    const loginProvider = new BrowserLoginProvider(tenant)
    return loginProvider.login(options.storeJwt)
  }
}

module.exports = login
