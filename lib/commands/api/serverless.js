/* @flow */
'use strict'

/* ::
import type {
  CLIFlags,
  CLIOptions
} from '../../api/types.js'
*/

const lib = require('../../api/serverless.js')

module.exports = function(
  tenant /* : Tenant */,
  input /* : Array<string> */,
  flags /* : CLIFlags */,
  logger /* : typeof console */,
  options /* : CLIOptions */,
) /* : Promise<void> */ {
  const cwd = flags.cwd
  const out = flags.out
  const env = flags.env
  const bmServerVersion = flags.bmServerVersion
  const vpcSecurityGroups = flags.vpcSecurityGroups || ''
  const vpcSubnets = flags.vpcSubnets || ''
  const deploymentBucket = flags.deploymentBucket
  const executionRole = flags.executionRole
  const analyticsConfig = {
    collectorToken: flags.analyticsCollectorToken,
    origin: flags.analyticsOrigin,
  }

  if (!out) {
    return Promise.reject(new Error('"--out" is mandatory'))
  }

  return lib.copyProject(cwd, out).then(projectPath => {
    return lib
      .applyTemplate(out)
      .then(() => lib.copyWrapper(out))
      .then(() => lib.copyConfiguration(out, projectPath, env))
      .then(() => lib.registerFunctions(tenant, out, projectPath, env))
      .then(() => lib.registerNodeVersion(out, bmServerVersion))
      .then(() => lib.registerDeploymentBucket(out, deploymentBucket))
      .then(() => lib.registerExecutionRole(out, executionRole))
      .then(() => lib.registerRootProxy(out, env))
      .then(() =>
        lib.registerVpc(
          out,
          projectPath,
          env,
          vpcSecurityGroups,
          vpcSubnets,
          ',',
        ),
      )
      .then(() => lib.registerVariables(out, projectPath, env, analyticsConfig))
  })
}
