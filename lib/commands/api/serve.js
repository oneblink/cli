/* @flow */
'use strict'

/* ::
import type {
  BlinkMRCServer,
  CLIFlags,
  CLIOptions
} from '../../api/types.js'
*/

const path = require('path')

const chalk = require('chalk')

const readCors = require('../../api/cors/read.js')
const serve = require('../../api/serve.js')
const displayRoutes = require('../../api/routes/display.js')
const scope = require('../../api/scope.js')

module.exports = async function (
  tenant /* : Tenant */,
  input /* : Array<string> */,
  flags /* : CLIFlags */,
  logger /* : typeof console */,
  options /* : CLIOptions */,
) /* : Promise<void> */ {
  const cfg = await scope.read(flags.cwd)
  const cwd = path.resolve(flags.cwd)
  const cors = await readCors(cwd)
  const port = flags.port || 3000
  await serve.startServer(
    tenant,
    logger,
    {
      cors,
      cwd,
      env: flags.env,
      port,
      options,
    },
    cfg,
    options.oneblinkAPIClient,
    flags.env,
  )
  await displayRoutes(logger, flags.cwd)
  if (cfg.awsProfile) {
    logger.log(`You are using the following AWS profile: ${cfg.awsProfile}`)
  } else {
    logger.log(
      'No AWS profile has been configured in the .blinkmrc file. A generic role has been assumed.',
    )
  }
  logger.log(`
HTTP service for local development is available from:
  http://localhost:${port}

${chalk.yellow('Hit CTRL-C to stop the service')}
`)
}
