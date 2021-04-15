import type { RouteConfiguration } from '../types'

import readRoutes from './read'

function getRouteConfig(
  cwd: string,
  route: string,
): Promise<RouteConfiguration> {
  return readRoutes(cwd).then((routeConfigs) => {
    const routeConfig = routeConfigs.find((rc) => rc.route === route)
    if (!routeConfig) {
      return Promise.reject(
        new Error(`Project does not contain route: ${route}`),
      )
    }
    return routeConfig
  })
}

export default getRouteConfig
