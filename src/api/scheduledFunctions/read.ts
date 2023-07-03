import scope from '../scope.js'
import values from '../values.js'
import { ScheduledFunctionConfiguration } from '../types.js'

export default async function readScheduledFunctions(
  cwd: string,
): Promise<ScheduledFunctionConfiguration[]> {
  const config = await scope.read(cwd)
  const scheduledFunctions = config.scheduledFunctions || []
  return scheduledFunctions.map((scheduledFunction) => ({
    ...scheduledFunction,
    timeout:
      scheduledFunction.timeout ||
      config.timeout ||
      values.DEFAULT_TIMEOUT_SECONDS,
  }))
}
