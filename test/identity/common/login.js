// @flow
'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')

const loginProviderMock = require('../helpers/login-provider.js')
const config = require('../../../lib/config.js')

const TEST_SUBJECT = '../../../lib/identity/common/login.js'

const JWT = 'valid jwt'

test.beforeEach(t => {
  t.context.usernameLoginProvider = loginProviderMock((username, password) => {
    return Promise.resolve(JWT)
  })

  t.context.browserLoginProvider = loginProviderMock(() => {
    return Promise.resolve(JWT)
  })
})

test.cb('login() should return valid jwt from provider', t => {
  const login = proxyquire(TEST_SUBJECT, {
    '../login-providers/username.js': t.context.usernameLoginProvider,
    '../login-providers/browser.js': t.context.browserLoginProvider,
  })

  login(config.TENANTS.ONEBLINK)
    .then(jwt => {
      t.is(jwt, JWT)
      t.end()
    })
    .catch(() => {
      t.fail()
      t.end()
    })
})

test.cb(
  'login() should create a usernameLoginProvider if all options are passed',
  t => {
    const login = proxyquire(TEST_SUBJECT, {
      '../login-providers/username.js': loginProviderMock(
        (username, password) => {
          t.is(username, 'test')
          t.is(password, 'pass')
          t.end()
          return Promise.resolve(JWT)
        },
      ),
      '../login-providers/browser.js': t.context.browserLoginProvider,
    })

    login(config.TENANTS.ONEBLINK, {
      username: 'test',
      password: 'pass',
    }).catch(() => {
      t.fail()
      t.end()
    })
  },
)

test.cb(
  'login() should create a usernameLoginProvider and call login() with null if username is passed in as true',
  t => {
    const login = proxyquire(TEST_SUBJECT, {
      '../login-providers/username.js': loginProviderMock(
        (username, password) => {
          t.is(username, null)
          t.is(password, 'pass')
          t.end()
          return Promise.resolve(JWT)
        },
      ),
      '../login-providers/browser.js': t.context.browserLoginProvider,
    })

    login(config.TENANTS.ONEBLINK, {
      username: true,
      password: 'pass',
    }).catch(() => {
      t.fail()
      t.end()
    })
  },
)

test.cb(
  'login() should create an browserLoginProvider if no option are passed',
  t => {
    const login = proxyquire(TEST_SUBJECT, {
      '../login-providers/username.js': t.context.usernameLoginProvider,
      '../login-providers/browser.js': loginProviderMock(() => {
        t.pass()
        t.end()
        return Promise.resolve(JWT)
      }),
    })

    login(config.TENANTS.ONEBLINK).catch(() => {
      t.fail()
      t.end()
    })
  },
)

test('login() should set the correct default for storeJwt option', t => {
  const login = proxyquire(TEST_SUBJECT, {
    '../login-providers/username.js': t.context.usernameLoginProvider,
    '../login-providers/browser.js': loginProviderMock((clientId, storeJwt) => {
      t.falsy(storeJwt)
      return Promise.resolve(JWT)
    }),
  })

  return login(config.TENANTS.ONEBLINK)
})

test('login() should leave the storeJwt option as true is set to true', t => {
  const login = proxyquire(TEST_SUBJECT, {
    '../login-providers/username.js': t.context.usernameLoginProvider,
    '../login-providers/browser.js': loginProviderMock(storeJwt => {
      t.is(storeJwt, true)
      return Promise.resolve(JWT)
    }),
  })

  return login(config.TENANTS.ONEBLINK, { storeJwt: true })
})

test('login() should leave the storeJwt option as false is set to false', t => {
  const login = proxyquire(TEST_SUBJECT, {
    '../login-providers/username.js': t.context.usernameLoginProvider,
    '../login-providers/browser.js': loginProviderMock(storeJwt => {
      t.is(storeJwt, false)
      return Promise.resolve(JWT)
    }),
  })

  return login(config.TENANTS.ONEBLINK, { storeJwt: false })
})
