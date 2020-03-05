/* @flow */
'use strict'

const objectMerge = require('object-merge')

const configHelper = require('./utils/config-helper')
const DEFAULTS = {
  Expires: 60,
  ACL: 'public-read',
}

function toS3(cfg /* : Object */, region /* : string */) {
  return {
    computeChecksums: true,
    region: region,
    params: Object.assign({}, cfg.cdn.objectParams, { Bucket: cfg.cdn.scope }),
  }
}

function read(
  cwd /* : string */,
  region /* : string */,
) /* : Promise<Object> */ {
  return configHelper
    .read(cwd)
    .then(cfg => (cfg.cdn.objectParams ? cfg : write(cwd, DEFAULTS)))
    .then(cfg => toS3(cfg, region))
}

function write(cwd, options) {
  return configHelper.write(cwd, config =>
    objectMerge(config, { cdn: { objectParams: options } }),
  )
}

module.exports = { read }
