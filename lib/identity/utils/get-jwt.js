/* @flow */
'use strict'

const userConfig = require('./user-config.js')

function getJWT() /* : Promise<string | void> */ {
  // Returning accessToken if id_token is not set to be backward compatible
  return userConfig
    .getStore()
    .load()
    .then(config => config.id_token || config.accessToken)
}

module.exports = getJWT
