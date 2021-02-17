import type { RouteConfiguration } from './types'

import util from 'util'

import glob from 'glob'

import values from './values'

function listAPIs(cwd: string): Promise<Array<string>> {
  return util
    .promisify(glob)('./*/index', { cwd })
    .then((matches) => matches.map((match) => match.split('/')[1]))
}

function listRoutes(cwd: string): Promise<Array<RouteConfiguration>> {
  return listAPIs(cwd).then((apis) =>
    apis.map((api) => ({
      route: `/${api}`,
      module: `./${api}/index.js`,
      timeout: values.DEFAULT_TIMEOUT_SECONDS,
    })),
  )
}

export default {
  listAPIs,
  listRoutes,
}
