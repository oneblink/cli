// @flow
'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')

const loginProviderBaseMock = require('../helpers/login-provider-base.js')
const inquirerMock = require('../helpers/inquirer.js')
const config = require('../../../lib/config.js')

const TEST_SUBJECT = '../../../lib/identity/login-providers/username.js'

const JWT = 'valid jwt'
const USERNAME = 'username'
const PASSWORD = 'password'

test.beforeEach((t) => {
  t.context.loginProviderBase = loginProviderBaseMock(null, () =>
    Promise.resolve(JWT),
  )

  t.context.inquirer = inquirerMock()
})

test.cb('login() should return valid jwt', (t) => {
  const UsernameLoginProvider = proxyquire(TEST_SUBJECT, {
    inquirer: t.context.inquirer,
    'aws-sdk': {
      CognitoIdentityServiceProvider: class {
        initiateAuth() {
          return {
            promise: () =>
              Promise.resolve({
                AuthenticationResult: {
                  IdToken: JWT,
                },
              }),
          }
        }
      },
    },
  })
  const usernameLoginProvider = new UsernameLoginProvider(
    config.TENANTS.ONEBLINK,
  )

  usernameLoginProvider
    .login(USERNAME, PASSWORD)
    .then((jwt) => {
      t.is(jwt, JWT)
      t.end()
    })
    .catch((e) => {
      t.fail(e)
      t.end()
    })
})

test.cb(
  'login() should ask for username and password if username and password is not passed in',
  (t) => {
    t.plan(3)
    const UsernameLoginProvider = proxyquire(TEST_SUBJECT, {
      inquirer: inquirerMock((questions) => {
        t.truthy(questions.find((question) => question.name === 'username'))
        t.truthy(questions.find((question) => question.name === 'password'))
        t.is(questions.length, 2)
        return Promise.resolve(
          questions.reduce((memo, question) => {
            memo[question.name] = question.name
            return memo
          }, {}),
        )
      }),
      'aws-sdk': {
        CognitoIdentityServiceProvider: class {
          initiateAuth() {
            return {
              promise: () =>
                Promise.resolve({
                  AuthenticationResult: {
                    IdToken: JWT,
                  },
                }),
            }
          }
        },
      },
    })
    const usernameLoginProvider = new UsernameLoginProvider(
      config.TENANTS.ONEBLINK,
    )

    usernameLoginProvider
      .login()
      .then(() => {
        t.end()
      })
      .catch((e) => {
        t.fail(e)
        t.end()
      })
  },
)

test.cb(
  'login() should should reject if username is not returned from the prompt',
  (t) => {
    const UsernameLoginProvider = proxyquire(TEST_SUBJECT, {
      inquirer: inquirerMock(() => {
        return Promise.resolve({})
      }),
      'aws-sdk': {
        CognitoIdentityServiceProvider: class {
          initiateAuth() {
            return {
              promise: () =>
                Promise.resolve({
                  AuthenticationResult: {
                    IdToken: JWT,
                  },
                }),
            }
          }
        },
      },
    })
    const usernameLoginProvider = new UsernameLoginProvider(
      config.TENANTS.ONEBLINK,
    )

    usernameLoginProvider
      .login()
      .then(() => {
        t.fail(new Error('Login was suppose to throw an Error'))
        t.end()
      })
      .catch((error) => {
        t.deepEqual(error, new Error('Please specify a username.'))
        t.end()
      })
  },
)

test.cb(
  'login() should should reject if password is not returned from the prompt',
  (t) => {
    const UsernameLoginProvider = proxyquire(TEST_SUBJECT, {
      inquirer: inquirerMock(() => {
        return Promise.resolve({
          username: USERNAME,
        })
      }),
      'aws-sdk': {
        CognitoIdentityServiceProvider: class {
          initiateAuth() {
            return {
              promise: () =>
                Promise.resolve({
                  AuthenticationResult: {
                    IdToken: JWT,
                  },
                }),
            }
          }
        },
      },
    })
    const usernameLoginProvider = new UsernameLoginProvider(
      config.TENANTS.ONEBLINK,
    )

    usernameLoginProvider
      .login()
      .then(() => {
        t.fail(new Error('Login was suppose to throw an Error'))
        t.end()
      })
      .catch((error) => {
        t.deepEqual(error, new Error('Please specify a password.'))
        t.end()
      })
  },
)
