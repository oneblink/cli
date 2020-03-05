/* @flow */
'use strict'

/* ::
import type {
  Handler,
  BmRequest,
  RouteConfiguration
} from './types.js'
*/

const uniloc = require('uniloc')

const BmResponse = require('./bm-response.js')

function executeHandler(
  handler /* : Handler */,
  request /* : BmRequest */,
) /* : Promise<BmResponse> */ {
  const response = new BmResponse()
  return Promise.resolve()
    .then(() => handler(request, response))
    .then(result => {
      // If a result has been returned:
      // try and set status code or
      // try and set payload
      if (result && result !== response) {
        if (Number.isFinite(result)) {
          response.setStatusCode(result)
        } else {
          response.setPayload(result)
        }
      }
      return response
    })
}

function getHandler(
  module /* : string */,
  method /* : string */,
) /* : Promise<Handler | void> */ {
  try {
    // $FlowIssue in this case, we explicitly `require()` dynamically
    let handler = require(module)
    if (handler && method && typeof handler[method] === 'function') {
      handler = handler[method]
    }
    return Promise.resolve(handler)
  } catch (err) {
    return Promise.reject(err)
  }
}

function findRouteConfig(
  route /* : string */,
  routeConfigs /* : RouteConfiguration[] */,
) /* : RouteConfiguration */ {
  const unilocRoutes = routeConfigs.reduce((memo, r) => {
    memo[r.route] = `GET ${r.route.replace(/{/g, ':').replace(/}/g, '')}`
    return memo
  }, {})
  const unilocRouter = uniloc(unilocRoutes)
  const unilocRoute = unilocRouter.lookup(route, 'GET')

  const routeConfig = routeConfigs.find(
    routeConfig => routeConfig.route === unilocRoute.name,
  )
  if (!routeConfig) {
    throw new Error(`Route has not been implemented: ${route}`)
  }

  routeConfig.params = unilocRoute.options
  return routeConfig
}

module.exports = {
  findRouteConfig,
  executeHandler,
  getHandler,
}
