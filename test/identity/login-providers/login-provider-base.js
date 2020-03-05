// @flow
'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')

const userConfigStoreMock = require('../helpers/user-config.js')
const requestMock = require('../helpers/request.js')
const config = require('../../../lib/config.js')

const TEST_SUBJECT =
  '../../../lib/identity/login-providers/login-provider-base.js'

const JWT = 'valid jwt'

test.beforeEach(t => {
  t.context.userConfigStore = userConfigStoreMock(() => {
    return Promise.resolve({ accessToken: JWT })
  })

  t.context.request = requestMock((url, data, callback) => {
    callback(
      null,
      {},
      {
        id_token: JWT,
      },
    )
  })
})

test.cb('storeJWT() should store jwt', t => {
  const LoginProviderBase = proxyquire(TEST_SUBJECT, {
    request: t.context.request,
    '../utils/user-config.js': t.context.userConfigStore,
  })
  const loginProviderBase = new LoginProviderBase(config.TENANTS.ONEBLINK)

  loginProviderBase
    .storeJWT({ id_token: JWT })
    .then(() => {
      t.pass()
      t.end()
    })
    .catch(() => {
      t.fail()
      t.end()
    })
})
