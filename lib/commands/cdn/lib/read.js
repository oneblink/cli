'use strict'
// @flow

const configHelper = require('./utils/config-helper')
module.exports = (
  cwd /* : string */,
  tenant /* : Tenant */,
) /* : Promise<Object> */ => {
  return configHelper
    .read(cwd)
    .then(cfg => (cfg.cdn ? cfg.cdn : {}))
    .then(cfg => {
      // Set defaults for service
      cfg.service = cfg.service || {}

      return cfg
    })
}
