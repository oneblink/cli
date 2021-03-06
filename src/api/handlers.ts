import type { RouteConfiguration } from './types'

import uniloc from 'uniloc'

import BmResponse from './bm-response'
import { APITypes } from '@oneblink/types'

export const ENTRY_FUNCTION = 'handler'

async function executeHandler<In = void, Out = void>(
  handler: APITypes.OneBlinkAPIHostingHandler<In, Out>,
  request: APITypes.OneBlinkAPIHostingRequest<In>,
): Promise<APITypes.OneBlinkAPIHostingResponse<Out>> {
  const response = new BmResponse<Out>()
  const result = await handler(request, response)
  // If a result has been returned:
  // try and set status code or
  // try and set payload
  if (result && result !== response) {
    if (Number.isFinite(result) && typeof result === 'number') {
      response.setStatusCode(result)
    } else {
      response.setPayload(result as Out)
    }
  }
  return response
}

function getHandler<In = void, Out = void>(
  module: string,
  method: string,
): Promise<APITypes.OneBlinkAPIHostingHandler<In, Out> | void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
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
  route: string,
  routeConfigs: RouteConfiguration[],
): RouteConfiguration {
  const unilocRoutes = routeConfigs.reduce<Record<string, string>>(
    (memo, r) => {
      memo[r.route] = `GET ${r.route.replace(/{/g, ':').replace(/}/g, '')}`
      return memo
    },
    {},
  )
  const unilocRouter = uniloc(unilocRoutes)
  const unilocRoute = unilocRouter.lookup(route, 'GET')

  const routeConfig = routeConfigs.find(
    (routeConfig) => routeConfig.route === unilocRoute.name,
  )
  if (!routeConfig) {
    throw new Error(`Route has not been implemented: ${route}`)
  }

  routeConfig.params = unilocRoute.options
  return routeConfig
}

export default {
  ENTRY_FUNCTION,
  findRouteConfig,
  executeHandler,
  getHandler,
}
