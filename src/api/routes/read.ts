import type { RouteConfiguration } from '../types'

import scope from '../scope'
import project from '../project'
import values from '../values'

function readRoutes(cwd: string): Promise<Array<RouteConfiguration>> {
  return scope.read(cwd).then((config) => {
    return Promise.resolve()
      .then(() => config.routes || project.listRoutes(cwd))
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
