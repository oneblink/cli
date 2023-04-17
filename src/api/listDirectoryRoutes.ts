import type { RouteConfiguration } from './types.js'

import { glob } from 'glob'

import values from './values.js'

export default async function listRoutes(
  cwd: string,
): Promise<Array<RouteConfiguration>> {
  const matches = await glob('./*/index.js', { cwd })
  return matches.map((match) => {
    const module = `./${match}`
    return {
      route: `/${module.split('/')[1]}`,
      module,
      timeout: values.DEFAULT_TIMEOUT_SECONDS,
    }
  })
}
