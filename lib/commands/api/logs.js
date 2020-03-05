/* @flow */
'use strict'

/* ::
import type {
  CLIFlags,
  CLIOptions
} from '../../api/types.js'
*/

const pify = require('pify')
const temp = require('temp').track()

const scope = require('../../api/scope.js')
const serverless = require('../../api/serverless.js')
const logs = require('../../api/logs.js')

module.exports = function(
  tenant /* : Tenant */,
  input /* : Array<string> */,
  flags /* : CLIFlags */,
  logger /* : typeof console */,
  options /* : CLIOptions */,
) /* : Promise<void> */ {
  return Promise.all([
    scope.read(flags.cwd),
    pify(temp.mkdir)('serverless'),
  ]).then(results => {
    const cfg = results[0]
    const tempDir = results[1]
    return serverless
      .applyTemplate(tempDir)
      .then(() =>
        serverless.registerFunctions(tenant, tempDir, flags.cwd, flags.env),
      )
      .then(() =>
        logs.authenticate(tenant, cfg, options.blinkMobileIdentity, flags.env),
      )
      .then(credentials => {
        const args = [
          'logs',
          '--function',
          serverless.getFunctionName(cfg, flags.env),
          '--region',
          tenant.region,
          '--stage',
          flags.env,
        ]
        if (flags.tail) {
          args.push('--tail')
        }
        if (flags.filter) {
          args.push('--filter', flags.filter)
        }
        if (flags.startTime) {
          args.push('--startTime', flags.startTime)
        }
        const options = {
          stdio: 'inherit',
          cwd: tempDir,
          env: Object.assign({}, process.env, {
            SLS_IGNORE_WARNING: '*',
            AWS_ACCESS_KEY_ID: credentials.accessKeyId,
            AWS_SECRET_ACCESS_KEY: credentials.secretAccessKey,
            AWS_SESSION_TOKEN: credentials.sessionToken,
          }),
        }
        return serverless
          .executeSLSCommand(args, options)
          .catch(() =>
            Promise.reject(
              new Error('See Serverless Error above for more details.'),
            ),
          )
      })
  })
}
