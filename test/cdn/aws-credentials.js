/* @flow */
'use strict'

const test = require('ava')
const mockery = require('mockery')

const requestModule = 'request'

const CFG = {
  objectParams: {
    ACL: 'public-read',
    Expires: 60,
  },
  region: 'ap-southeast-2',
  scope: 'customer-project.blinkm.io',
  service: {
    origin: 'http://localhost',
  },
}
const ACCESS_TOKEN = 'jwt'

const config = require('../../lib/config')
test.beforeEach(() => {
  mockery.enable({ useCleanCache: true })
  mockery.warnOnUnregistered(false)
})

test.afterEach(() => {
  mockery.warnOnUnregistered(true)
  mockery.deregisterAll()
  mockery.resetCache()
  mockery.disable()
})

test.serial('it should resolve aws credentials', t => {
  const Credentials = {
    AccessKeyId: 'id',
    SecretAccessKey: 'secret',
    SessionToken: 'token',
  }
  function requestMock(url, options, cb) {
    cb(
      null,
      {
        statusCode: 200,
      },
      {
        Credentials,
      },
    )
  }

  mockery.registerMock(requestModule, requestMock)

  const getAwsCredentials = require('../../lib/commands/cdn/lib/aws-credentials.js')
  return getAwsCredentials(
    CFG,
    'dev',
    ACCESS_TOKEN,
    config.TENANTS.ONEBLINK,
  ).then(credentials => {
    t.is(credentials.accessKeyId, Credentials.AccessKeyId)
    t.is(credentials.secretAccessKey, Credentials.SecretAccessKey)
    t.is(credentials.sessionToken, Credentials.SessionToken)
  })
})

test.serial(
  'it should reject and stop the spinner if request for aws credentials fails',
  t => {
    function requestMock(url, options, cb) {
      cb(new Error('test error'))
    }

    mockery.registerMock(requestModule, requestMock)

    const getAwsCredentials = require('../../lib/commands/cdn/lib/aws-credentials.js')
    return t.throwsAsync(
      () =>
        getAwsCredentials(CFG, 'dev', ACCESS_TOKEN, config.TENANTS.ONEBLINK),
      'test error',
    )
  },
)

test.serial(
  'it should reject and stop the spinner if aws credentials could not be retrieved',
  t => {
    function requestMock(url, options, cb) {
      cb(
        null,
        {
          statusCode: 403,
        },
        {
          message: 'Forbidden',
        },
      )
    }

    mockery.registerMock(requestModule, requestMock)

    const getAwsCredentials = require('../../lib/commands/cdn/lib/aws-credentials.js')
    return t.throwsAsync(
      () =>
        getAwsCredentials(CFG, 'dev', ACCESS_TOKEN, config.TENANTS.ONEBLINK),
      'Forbidden',
    )
  },
)
