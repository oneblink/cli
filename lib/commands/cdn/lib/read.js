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

      if (!cfg.service.origin && !!cfg.tenant) {
        cfg.service.origin = tenant.origin
      }
      cfg.service.origin = cfg.service.origin || tenant.origin
      cfg.region = tenant.region
      cfg.tenant = tenant.label

      return cfg
    })
}
