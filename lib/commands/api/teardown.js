/* @flow */
'use strict'

/* ::
import type {
  APIEnvironment,
  CLIFlags,
  CLIOptions
} from '../../api/types.js'
*/

const { teardown, confirm } = require('../../api/teardown.js')
const scope = require('../../api/scope.js')

module.exports = async function (
  tenant /* : Tenant */,
  input /* : Array<string> */,
  flags /* : CLIFlags */,
  logger /* : typeof console */,
  options /* : CLIOptions */,
) /* : Promise<void> */ {
  const env = flags.env
  const cwd = flags.cwd
  const force = flags.force

  const config = await scope.read(cwd)
  const apiId = config.project
  if (!apiId) {
    throw new Error('scope has not been set yet')
  }

  const confirmation = await confirm(logger, force, env)
  if (!confirmation) {
    return
  }

  await teardown(options.oneblinkAPIClient, apiId, env)
}
