// @flow
'use strict'

const test = require('ava')

const wrapper = require('../../scripts/wrapper.js')

test('exports a "handler" function', t => {
  t.is(typeof wrapper.handler, 'function')
})
