import type { CLIFlags, CLIOptions } from '../../api/types.js'

import { teardown, confirm } from '../../api/teardown.js'
import scope from '../../api/scope.js'

export default async function (
  tenant: Tenant,
  input: Array<string>,
  flags: CLIFlags,
  logger: typeof console,
  options: CLIOptions,
): Promise<void> {
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
