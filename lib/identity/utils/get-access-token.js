/* @flow */
'use strict'

const userConfig = require('./user-config.js')

function getAccessToken() /* : Promise<string | void> */ {
  return userConfig
    .getStore()
    .load()
    .then(config => config.access_token)
}

module.exports = getAccessToken
