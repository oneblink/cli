import type { CLIFlags, CLIOptions } from '../../api/types.js'

import os from 'os'

import displayCors from '../../api/cors/display.js'
import displayRoutes from '../../api/routes/display.js'
import scope from '../../api/scope.js'
import variables from '../../api/variables.js'
import network from '../../api/network.js'

export default async function (
  tenant: Tenant,
  input: Array<string>,
  flags: CLIFlags,
  logger: typeof console,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options: CLIOptions,
): Promise<void> {
  const tasks = [
    () => scope.display(logger, flags.cwd, flags.env),
    () => displayCors(logger, flags.cwd),
    () => displayRoutes(logger, flags.cwd),
    () => variables.display(logger, flags.cwd, flags.env),
    () => network.displayNetwork(logger, flags.cwd, flags.env),
  ]
  // Catch all errors and let all tasks run before
  // transforming into a single error
  const errors: Error[] = []
  for (const task of tasks) {
    try {
      await task()
    } catch (error) {
      errors.push(error as Error)
    }
  }
  if (errors && errors.length) {
    return Promise.reject(
      new Error(errors.map((error) => error.message).join(os.EOL)),
    )
  }
}
