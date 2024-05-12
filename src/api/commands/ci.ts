import type { CLIFlags, CLIOptions } from '../types.js'
import info from './info.js'
import readCors from '../cors/read.js'
import readRoutes from '../routes/read.js'
import network from '../network.js'
import variables from '../variables.js'
import readScheduledFunctions from '../scheduledFunctions/read.js'

export default async function (
  tenant: Tenant,
  input: Array<string>,
  flags: CLIFlags,
  logger: typeof console,
  options: CLIOptions,
): Promise<void> {
  // const oneblinkAPIClient = options.oneblinkAPIClient
  const cwd = flags.cwd
  const env = flags.env
  // const force = flags.force
  await info(tenant, input, flags, logger, options)

  // const config = await scope.read(cwd)

  const [cors, routes, networkConfig, envVars, scheduledFunctions] =
    await Promise.all([
      readCors(cwd),
      readRoutes(cwd),
      network.readNetwork(cwd, env),
      variables.read(cwd, env),
      readScheduledFunctions(cwd),
    ])

  console.log({
    cors,
    routes,
    networkConfig,
    envVars,
    scheduledFunctions,
  })
}
