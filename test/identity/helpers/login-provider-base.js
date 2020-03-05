'use strict'

const constants = require('../../../lib/config')

const privateVars = new WeakMap()

function loginProviderBaseMock(storeJwtFn, requestJwtFn) {
  storeJwtFn = storeJwtFn || (jwt => Promise.resolve(jwt))
  requestJwtFn = requestJwtFn || ((u, p, c) => Promise.resolve('jwt'))
  return class LoginProvider {
    constructor(clientId, clientName) {
      this.CONSTANTS = constants.TENANTS.ONEBLINK
      privateVars.set(this, {
        clientId,
        clientName,
      })
    }

    storeJWT(jwt) {
      return storeJwtFn(jwt)
    }

    requestJWT(username, password, connection) {
      return requestJwtFn(username, password, connection)
    }
  }
}

module.exports = loginProviderBaseMock
