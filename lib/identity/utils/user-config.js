/* @flow */
'use strict'

/* ::
import type {
  UserConfigStore
} from '..'
*/

const blinkmrc = require('@blinkmobile/blinkmrc')

const pkg = require('../../../package.json')

let userConfigStore

function getStore() /* : UserConfigStore */ {
  if (!userConfigStore) {
    userConfigStore = blinkmrc.userConfig({ name: pkg.name })
  }
  return userConfigStore
}

module.exports = {
  getStore,
}
