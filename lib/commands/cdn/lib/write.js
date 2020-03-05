'use strict'
// @flow

const configHelper = require('./utils/config-helper')
const objectMerge = require('object-merge')
module.exports = (
  cwd /* : string */,
  bucket /* : string */,
) /* : Promise<Object> */ => {
  if (!bucket) {
    return Promise.reject(new Error('Scope was not defined.'))
  }

  const values = { cdn: { scope: bucket } }
  return configHelper.write(cwd, config => objectMerge(config, values))
}
