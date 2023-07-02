import type { ScheduledFunctionConfiguration } from '../types.js'

import util from 'util'
import path from 'path'
import fs from 'fs'

const statAsync = util.promisify(fs.stat)

function validateScheduledFunctions(
  cwd: string,
  config: ScheduledFunctionConfiguration,
): Promise<Array<string>> {
  const errors: string[] = []
  // Serverless does not allow for a timeout more than 5 minutes
  if (
    typeof config.timeout === 'number' &&
    (config.timeout < 1 || config.timeout > 900)
  ) {
    errors.push('Timeout must be between 1 and 900 (inclusive)')
  }

  // Ensure module property is a relative path from cwd and exists
  return statAsync(path.resolve(cwd, config.module))
    .catch((err) => {
      if (err.code === 'ENOENT') {
        err.message = `Could not find module: ${config.module}`
      }
      errors.push(err.message)
    })
    .then(() => errors)
}

export default validateScheduledFunctions
