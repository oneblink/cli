import type { RouteConfiguration } from './types'

import util from 'util'

import glob from 'glob'

import values from './values'

const globAsync = util.promisify(glob)

export default async function listRoutes(
  cwd: string,
): Promise<Array<RouteConfiguration>> {
  const matches = await globAsync('./*/index.js', { cwd })
  return matches.map((module) => ({
    route: `/${module.split('/')[1]}`,
    module,
    timeout: values.DEFAULT_TIMEOUT_SECONDS,
  }))
}
