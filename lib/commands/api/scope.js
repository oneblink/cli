/* @flow */
'use strict'

/* ::
import type {
  CLIFlags,
  CLIOptions
} from '../../api/types.js'
*/

const scope = require('../../api/scope')

module.exports = function(
  tenant /* : Tenant */,
  input /* : Array<string> */,
  flags /* : CLIFlags */,
  logger /* : typeof console */,
  options /* : CLIOptions */,
) /* : Promise<void> */ {
  const cwd = flags.cwd
  const project = input[0]
  return Promise.resolve()
    .then(() => {
      if (project) {
        return scope.write(cwd, {
          project,
        })
      }
    })
    .then(() => scope.display(logger, cwd))
}
