import path from 'path'
import fs from 'fs/promises'
import { ScheduledFunctionConfiguration } from '../types.js'

export default async function validateScheduledFunction(
  cwd: string,
  config: ScheduledFunctionConfiguration,
): Promise<Array<string>> {
  const errors: string[] = []
  //Regex to make sure that only lowercase letters and dashes are allowed
  if (
    !config.name ||
    typeof config.name !== 'string' ||
    !config.name.match(/^[a-z-]*$/)
  ) {
    errors.push('"name" can only include lowercase letters and dashes')
  }

  if (!config.export || typeof config.export !== 'string') {
    errors.push('"export" must be a string')
  }

  if (!config.label || typeof config.label !== 'string') {
    errors.push('"label" must be a string')
  }

  // Serverless does not allow for a timeout more than 5 minutes
  if (
    typeof config.timeout === 'number' &&
    (config.timeout < 1 || config.timeout > 900)
  ) {
    errors.push('"timeout" must be between 1 and 900 (inclusive)')
  }

  // Ensure module property is a relative path from cwd and exists
  try {
    await fs.stat(path.resolve(cwd, config.module))
  } catch (error) {
    const err = error as Error
    if ('code' in err && err.code === 'ENOENT') {
      err.message = `Could not find module: ${config.module}`
    }
    errors.push(err.message)
  }
  return errors
}
