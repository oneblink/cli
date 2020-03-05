// @flow
'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const querystring = require('querystring')

const requestMock = require('../helpers/request.js')
const loginProviderBaseMock = require('../helpers/login-provider-base.js')
const inquirerMock = require('../helpers/inquirer.js')
const base64urlMock = require('../helpers/base-64-url.js')
const constants = require('../../../lib/identity/constants')
const config = require('../../../lib/config.js')

const TEST_SUBJECT = '../../../lib/identity/login-providers/browser.js'

const JWT = 'valid jwt'
const CODE = 'abc123'
const VERIFIER_CHALLENGE = 'verifier challenge'

test.beforeEach(t => {
  t.context.log = console.log
  // $FlowFixMe
  console.log = function(content) {}

  t.context.loginProviderBase = loginProviderBaseMock(jwt => {
    return Promise.resolve(jwt)
  })

  t.context.request = requestMock((url, body, callback) => {
    callback(
      null,
      {},
      {
        id_token: JWT,
      },
    )
  })

  t.context.inquirer = inquirerMock(questions => {
    return Promise.resolve({
      code: CODE,
    })
  })

  t.context.open = (url, options) => {}

  t.context.base64url = base64urlMock(bytes => VERIFIER_CHALLENGE)
})

test.afterEach(t => {
  // $FlowFixMe
  console.log = t.context.log
})

test.cb('login() should return valid jwt', t => {
  const BrowserLoginProvider = proxyquire(TEST_SUBJECT, {
    inquirer: t.context.inquirer,
    request: t.context.request,
    open: t.context.open,
    base64url: t.context.base64url,
    './login-provider-base.js': t.context.loginProviderBase,
  })
  const browserLoginProvider = new BrowserLoginProvider(config.TENANTS.ONEBLINK)

  browserLoginProvider
    .login()
    .then(jwt => {
      t.is(jwt, JWT)
      t.end()
    })
    .catch(error => {
      t.fail(error)
      t.end()
    })
})

test.cb('login() should call opn with correct data in url', t => {
  const BrowserLoginProvider = proxyquire(TEST_SUBJECT, {
    inquirer: t.context.inquirer,
    request: t.context.request,
    open: (url, options) => {
      const expectedQS = querystring.stringify({
        response_type: 'code',
        scope: constants.SCOPE,
        client_id: config.TENANTS.ONEBLINK.loginClientId,
        redirect_uri: config.TENANTS.ONEBLINK.loginCallbackUrl,
        code_challenge: VERIFIER_CHALLENGE,
        code_challenge_method: 'S256',
      })
      t.is(url, `${config.TENANTS.ONEBLINK.loginUrl}/authorize?${expectedQS}`)
      t.deepEqual(options, {
        wait: false,
      })
      t.end()
    },
    base64url: t.context.base64url,
    './login-provider-base.js': t.context.loginProviderBase,
  })
  const browserLoginProvider = new BrowserLoginProvider(config.TENANTS.ONEBLINK)

  browserLoginProvider.login().catch(error => {
    t.fail(error)
    t.end()
  })
})

test.cb('login() should log a message to the console', t => {
  const BrowserLoginProvider = proxyquire(TEST_SUBJECT, {
    inquirer: t.context.inquirer,
    request: t.context.request,
    open: t.context.open,
    base64url: t.context.base64url,
    './login-provider-base.js': t.context.loginProviderBase,
  })
  const browserLoginProvider = new BrowserLoginProvider(config.TENANTS.ONEBLINK)

  // $FlowFixMe
  console.log = function(content) {
    t.is(
      content,
      'A browser has been opened to allow you to login. Once logged in, you will be granted a verification code.',
    )
  }

  browserLoginProvider
    .login()
    .then(jwt => {
      t.end()
    })
    .catch(error => {
      t.fail(error)
      t.end()
    })
})

test.cb('login() should prompt with the correct question', t => {
  const BrowserLoginProvider = proxyquire(TEST_SUBJECT, {
    inquirer: inquirerMock(questions => {
      t.is(questions.length, 1)
      t.deepEqual(questions[0], {
        type: 'input',
        name: 'code',
        message: 'Please enter the code: ',
      })
      t.end()
      return Promise.resolve({
        code: CODE,
      })
    }),
    request: t.context.request,
    open: t.context.open,
    base64url: t.context.base64url,
    './login-provider-base.js': t.context.loginProviderBase,
  })
  const browserLoginProvider = new BrowserLoginProvider(config.TENANTS.ONEBLINK)

  browserLoginProvider.login().catch(error => {
    t.fail(error)
    t.end()
  })
})

test.cb('login() should make request with the correct url and data', t => {
  const BrowserLoginProvider = proxyquire(TEST_SUBJECT, {
    inquirer: t.context.inquirer,
    request: requestMock((url, body, callback) => {
      t.is(url, `${config.TENANTS.ONEBLINK.loginUrl}/oauth2/token`)
      t.deepEqual(body.form, {
        code: CODE,
        code_verifier: VERIFIER_CHALLENGE,
        client_id: config.TENANTS.ONEBLINK.loginClientId,
        grant_type: 'authorization_code',
        redirect_uri: config.TENANTS.ONEBLINK.loginCallbackUrl,
      })
      t.end()
      callback(null, {}, {})
    }),
    open: t.context.open,
    base64url: t.context.base64url,
    './login-provider-base.js': t.context.loginProviderBase,
  })
  const browserLoginProvider = new BrowserLoginProvider(config.TENANTS.ONEBLINK)

  browserLoginProvider.login().catch(error => {
    t.fail(error)
    t.end()
  })
})

test('login() should should reject if request returns an error', t => {
  t.plan(1)
  const BrowserLoginProvider = proxyquire(TEST_SUBJECT, {
    inquirer: t.context.inquirer,
    request: requestMock((url, body, callback) => {
      callback(new Error('Test error message'))
    }),
    open: t.context.open,
    base64url: t.context.base64url,
    './login-provider-base.js': t.context.loginProviderBase,
  })
  const browserLoginProvider = new BrowserLoginProvider(config.TENANTS.ONEBLINK)

  return browserLoginProvider.login().catch(error => {
    t.deepEqual(error, new Error('Test error message'))
  })
})

test.cb(
  'login() should should reject if request returns an error in the body',
  t => {
    const BrowserLoginProvider = proxyquire(TEST_SUBJECT, {
      inquirer: t.context.inquirer,
      request: requestMock((url, body, callback) => {
        callback(
          null,
          {},
          {
            error: 'error code',
            error_description: 'test error message',
          },
        )
      }),
      open: t.context.open,
      base64url: t.context.base64url,
      './login-provider-base.js': t.context.loginProviderBase,
    })
    const browserLoginProvider = new BrowserLoginProvider(
      config.TENANTS.ONEBLINK,
    )

    browserLoginProvider
      .login()
      .then(() => {
        t.fail()
        t.end()
      })
      .catch(error => {
        t.deepEqual(error, new Error('test error message'))
        t.end()
      })
  },
)
