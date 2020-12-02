/* @flow */
'use strict'

/* ::
import type {
  HandlerConfiguration,
  RouteConfiguration
} from './types.js'
*/

const path = require('path')

const handlers = require('./handlers.js')
const readRoutes = require('./routes/read.js')

function getHandlerConfig /* :: <In = void, Out = void> */(
  routeConfig /* : RouteConfiguration */,
  method /* : string */,
) /* : Promise<HandlerConfiguration<In, Out>> */ {
  return handlers.getHandler(routeConfig.module, method).then((handler) => ({
    handler,
    params: routeConfig.params || {},
  }))
}

function getRouteConfig(
  cwd /* : string */,
  route /* : string */,
) /* : Promise<RouteConfiguration> */ {
  return readRoutes(cwd)
    .then((routeConfigs) => handlers.findRouteConfig(route, routeConfigs))
    .then((routeConfig) => {
      routeConfig.module = path.resolve(cwd, routeConfig.module)
      return routeConfig
    })
}

module.exports = {
  getHandlerConfig,
  getRouteConfig,
}
