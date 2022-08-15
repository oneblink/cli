import type { RouteConfiguration } from '../types.js'

import util from 'util'
import path from 'path'
import fs from 'fs'

const statAsync = util.promisify(fs.stat)

function validateRoute(
  cwd: string,
  routeConfig: RouteConfiguration,
): Promise<Array<string>> {
  const errors: string[] = []
  // Ensure route property starts with a '/'
  if (!routeConfig.route.startsWith('/')) {
    errors.push('Route must start with a "/"')
  }
  // Serverless does not allow for a timeout more than 5 minutes
  if (
    typeof routeConfig.timeout === 'number' &&
    (routeConfig.timeout < 1 || routeConfig.timeout > 900)
  ) {
    errors.push('Timeout must be between 1 and 900 (inclusive)')
  }

  // Ensure module property is a relative path from cwd and exists
  return statAsync(path.resolve(cwd, routeConfig.module))
    .catch((err) => {
      if (err.code === 'ENOENT') {
        err.message = `Could not find module: ${routeConfig.module}`
      }
      errors.push(err.message)
    })
    .then(() => errors)
}

export default validateRoute
