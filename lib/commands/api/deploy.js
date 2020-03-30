/* @flow */
'use strict'

/* ::
import type {
  APIEnvironment,
  CLIFlags,
  CLIOptions
} from '../../api/types.js'
*/

const info = require('./info.js')
const deploy = require('../../api/deploy.js')
const scope = require('../../api/scope.js')

module.exports = async function (
  tenant /* : Tenant */,
  input /* : Array<string> */,
  flags /* : CLIFlags */,
  logger /* : typeof console */,
  options /* : CLIOptions */,
) /* : Promise<void> */ {
  const blinkMobileIdentity = options.blinkMobileIdentity
  const cwd = flags.cwd
  const env = flags.env
  const force = flags.force
  await info(tenant, input, flags, logger, options)
  const confirmation = await deploy.confirm(logger, force, env)
  if (!confirmation) {
    return
  }

  const config = await scope.read(cwd)

  const [deploymentCredentials, accessToken] = await deploy.authenticate(
    tenant,
    config,
    blinkMobileIdentity,
    env,
  )

  const [out, apiDeploymentPayload] = await deploy.copy(
    deploymentCredentials,
    config,
    cwd,
    env,
  )
  await deploy.pruneDevDependencies(out)
  const zipFilePath = await deploy.zip(out)
  await deploy.upload(zipFilePath, deploymentCredentials)
  await deploy.deploy(tenant, apiDeploymentPayload, accessToken, env)
}
