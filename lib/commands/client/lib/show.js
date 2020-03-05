'use strict'
// @flow

const read = require('./read')
module.exports = async (
  cwd /* : string */,
  tenant /* : Tenant */,
) /* : Promise<void> */ => {
  const cfg = await read(cwd, tenant)
  cfg.scope ? log(cfg) : console.log('S3 Bucket scope has not been set yet.')
}

function log({ scope }) {
  console.log(`S3 Bucket name: ${scope}`)
}
