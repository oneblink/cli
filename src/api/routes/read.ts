import type { RouteConfiguration } from '../types.js'

import scope from '../scope.js'
import listDirectoryRoutes from '../listDirectoryRoutes.js'
import values from '../values.js'

function readRoutes(cwd: string): Promise<Array<RouteConfiguration>> {
  return scope.read(cwd).then((config) => {
    return Promise.resolve()
      .then(() => config.routes || listDirectoryRoutes(cwd))
      .then((routes) => routes || [])
      .then((routes) =>
        routes.map((route: RouteConfiguration) => {
          route.timeout =
            route.timeout || config.timeout || values.DEFAULT_TIMEOUT_SECONDS
          return route
        }),
      )
  })
}

export default readRoutes
