/* @flow */
'use strict'

const BlinkMobileIdentity = require('../../../lib/identity')

class BlinkMobileIdentityMock extends BlinkMobileIdentity {
  getAccessToken() /* : Promise<string> */ {
    return Promise.resolve('access token')
  }
}

module.exports = BlinkMobileIdentityMock
