'use strict'

const test = require('ava')

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

test('it should resolve', (t) => {
  // $FlowFixMe
  const oneBlinkAPIClient /* : OneBlinkAPIClient */ = {
    postRequest: async () => ({
      brandedUrl: '',
    }),
  }

  const provision = require('../../lib/commands/cdn/lib/provision-environment.js')
  return t.notThrowsAsync(() => provision(CFG, 'dev', oneBlinkAPIClient))
})

test('it should reject and stop the spinner if request fails', (t) => {
  // $FlowFixMe
  const oneBlinkAPIClient /* : OneBlinkAPIClient */ = {
    postRequest: async () => {
      throw new Error('test error')
    },
  }

  const provision = require('../../lib/commands/cdn/lib/provision-environment.js')
  return t.throwsAsync(
    () => provision(CFG, 'dev', oneBlinkAPIClient),
    'test error',
  )
})
