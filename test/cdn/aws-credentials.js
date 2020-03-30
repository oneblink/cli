/* @flow */
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

test('it should resolve aws credentials', (t) => {
  const Credentials = {
    AccessKeyId: 'id',
    SecretAccessKey: 'secret',
    SessionToken: 'token',
  }

  // $FlowFixMe
  const oneBlinkAPIClient /* : OneBlinkAPIClient */ = {
    postRequest: async () => ({
      Credentials,
    }),
  }

  const getAwsCredentials = require('../../lib/commands/cdn/lib/aws-credentials.js')
  return getAwsCredentials(CFG, 'dev', oneBlinkAPIClient).then(
    (credentials) => {
      t.is(credentials.accessKeyId, Credentials.AccessKeyId)
      t.is(credentials.secretAccessKey, Credentials.SecretAccessKey)
      t.is(credentials.sessionToken, Credentials.SessionToken)
    },
  )
})

test('it should reject and stop the spinner if request for aws credentials fails', (t) => {
  // $FlowFixMe
  const oneBlinkAPIClient /* : OneBlinkAPIClient */ = {
    postRequest: async () => {
      throw new Error('test error')
    },
  }

  const getAwsCredentials = require('../../lib/commands/cdn/lib/aws-credentials.js')
  return t.throwsAsync(
    () => getAwsCredentials(CFG, 'dev', oneBlinkAPIClient),
    'test error',
  )
})
