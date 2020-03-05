/* @flow */
'use strict'

/* ::
import type {RouteConfiguration} from '../types.js'
*/

const readRoutes = require('./read.js')

function getRouteConfig(
  cwd /* : string */,
  route /* : string */,
) /* : Promise<RouteConfiguration> */ {
  return readRoutes(cwd).then(routeConfigs => {
    const routeConfig = routeConfigs.find(rc => rc.route === route)
    if (!routeConfig) {
      return Promise.reject(
        new Error(`Project does not contain route: ${route}`),
      )
    }
    return routeConfig
  })
}

module.exports = getRouteConfig
