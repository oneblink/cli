/* @flow */
'use strict'

const test = require('ava')

test.serial('it should have the bucket name pre-configured', t => {
  const params = {
    region: 'region',
    params: {
      Bucket: 'a',
      Expires: 60,
      ACL: 'public-read',
    },
  }

  const s3Factory = require('../../lib/commands/client/lib/s3-bucket-factory.js')
  return s3Factory(params, {
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: '',
  }).then(s3 => t.is(s3.config.params.Bucket, params.params.Bucket))
})
