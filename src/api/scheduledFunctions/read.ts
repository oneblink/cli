import scope from '../scope.js'
import { ScheduledFunctionConfiguration } from '../types.js'
import values from '../values.js'

export default function readScheduledFunctions(
  cwd: string,
): Promise<Array<ScheduledFunctionConfiguration>> {
  return scope.read(cwd).then((config) => {
    return Promise.resolve()
      .then(() => config.scheduledFunctions)
      .then((scheduledFunctions) => scheduledFunctions || [])
      .then((scheduledFunctions) =>
        scheduledFunctions.map(
          (scheduledFunction: ScheduledFunctionConfiguration) => {
            scheduledFunction.timeout =
              scheduledFunction.timeout ||
              config.timeout ||
              values.DEFAULT_TIMEOUT_SECONDS
            return scheduledFunction
          },
        ),
      )
  })
}
