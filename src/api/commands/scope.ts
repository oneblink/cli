import type { CLIFlags, CLIOptions } from '../../api/types'

import scope from '../../api/scope'

export default async function (
  tenant: Tenant,
  input: Array<string>,
  flags: CLIFlags,
  logger: typeof console,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options: CLIOptions,
): Promise<void> {
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
    .then(() => scope.display(logger, cwd, undefined))
}
