import type { RouteConfiguration } from '../types'

import scope from '../scope'
import listDirectoryRoutes from '../listDirectoryRoutes'
import values from '../values'

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
