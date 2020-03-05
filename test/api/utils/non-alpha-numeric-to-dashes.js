'use strict'

const test = require('ava')

const lib = require('../../../lib/api/utils/non-alpha-numeric-to-dashes.js')

test('Should not contain any characters that are not alphanumberic or dashes', t => {
  const str = lib('`~!@#$%^&*()-_+={}[]\\|:;"\'<,>.?/')
  t.is(str, '--------------------------------')
})
