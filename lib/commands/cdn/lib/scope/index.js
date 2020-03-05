'use strict'
// @flow

const write = require('../write')
const show = require('../show')
module.exports = async (
  input /* : Array<string> */,
  flags /* : Object */,
  tenant /* : Tenant */,
) => {
  const bucket = flags.bucket || input[0]
  if (bucket) await write(flags.cwd, bucket)

  return show(flags.cwd, tenant)
}
