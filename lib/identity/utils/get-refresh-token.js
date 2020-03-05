/* @flow */
'use strict'

const userConfig = require('./user-config.js')

function getRefreshToken() /* : Promise<string | void> */ {
  return userConfig
    .getStore()
    .load()
    .then(config => config.refresh_token)
}

module.exports = getRefreshToken
