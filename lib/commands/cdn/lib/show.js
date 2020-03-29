'use strict'
// @flow

const read = require('./read')
module.exports = async (cwd /* : string */) /* : Promise<void> */ => {
  const cfg = await read(cwd)
  cfg.scope ? log(cfg) : console.log('S3 Bucket scope has not been set yet.')
}

function log({ scope }) {
  console.log(`S3 Bucket name: ${scope}`)
}
