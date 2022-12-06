import type { HandlerConfiguration, RouteConfiguration } from './types.js'

import path from 'path'
import url from 'url'

import handlers from './handlers.js'
import readRoutes from './routes/read.js'

function getHandlerConfig<In = undefined, Out = undefined>(
  routeConfig: RouteConfiguration,
  method: string,
): Promise<HandlerConfiguration<In, Out>> {
  return handlers
    .getHandler<In, Out>(routeConfig.module, method)
    .then((handler) => ({
      handler,
      params: routeConfig.params || {},
    }))
}

function getRouteConfig(
  cwd: string,
  route: string,
): Promise<RouteConfiguration> {
  return readRoutes(cwd)
    .then((routeConfigs) => handlers.findRouteConfig(route, routeConfigs))
    .then((routeConfig) => {
      const absoluteModule = path.resolve(cwd, routeConfig.module)
      const fileUrl = url.pathToFileURL(absoluteModule)
      routeConfig.module = fileUrl.href
      return routeConfig
    })
}

export default {
  getHandlerConfig,
  getRouteConfig,
}
