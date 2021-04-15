import type { CLIFlags, CLIOptions } from '../types'

import info from './info'
import deploy from '../deploy'
import scope from '../scope'

export default async function (
  tenant: Tenant,
  input: Array<string>,
  flags: CLIFlags,
  logger: typeof console,
  options: CLIOptions,
): Promise<void> {
  const oneblinkAPIClient = options.oneblinkAPIClient
  const cwd = flags.cwd
  const env = flags.env
  const force = flags.force
  await info(tenant, input, flags, logger, options)
  const confirmation = await deploy.confirm(logger, force, env)
  if (!confirmation) {
    return
  }

  const config = await scope.read(cwd)

  const deploymentCredentials = await deploy.authenticate(
    oneblinkAPIClient,
    config,
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
  await deploy.deploy(oneblinkAPIClient, apiDeploymentPayload, env)
}
