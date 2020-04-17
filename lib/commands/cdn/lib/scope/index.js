// @flow
'use strict'

/* ::
import OneBlinkIdentity from '../../../../identity'
*/

const write = require('../write')
const show = require('../show')
module.exports = async (
  input /* : Array<string> */,
  flags /* : Object */,
  // eslint-disable-next-line no-unused-vars
  oneblinkIdentity /* : OneBlinkIdentity */,
) => {
  const bucket = flags.bucket || input[0]
  if (bucket) await write(flags.cwd, bucket)

  return show(flags.cwd)
}
