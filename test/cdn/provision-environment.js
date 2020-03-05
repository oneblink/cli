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

test.serial('it should resolve', t => {
  const requestMock = {
    post: function(url, options, cb) {
      cb(
        null,
        {
          statusCode: 200,
        },
        {
          brandedUrl: '',
        },
      )
    },
  }

  mockery.registerMock(requestModule, requestMock)

  const provision = require('../../lib/commands/cdn/lib/provision-environment.js')
  return t.notThrowsAsync(() => provision(CFG, 'dev', ACCESS_TOKEN))
})

test.serial('it should reject and stop the spinner if request fails', t => {
  const requestMock = {
    post: function(url, options, cb) {
      cb(new Error('test error'))
    },
  }

  mockery.registerMock(requestModule, requestMock)

  const provision = require('../../lib/commands/cdn/lib/provision-environment.js')
  return t.throwsAsync(() => provision(CFG, 'dev', ACCESS_TOKEN), 'test error')
})

test.serial(
  'it should reject and stop the spinner if response is not 200',
  t => {
    const requestMock = {
      post: function(url, options, cb) {
        cb(
          null,
          {
            statusCode: 403,
          },
          {
            message: 'Forbidden',
          },
        )
      },
    }

    mockery.registerMock(requestModule, requestMock)

    const provision = require('../../lib/commands/cdn/lib/provision-environment.js')
    return t.throwsAsync(() => provision(CFG, 'dev', ACCESS_TOKEN), 'Forbidden')
  },
)
