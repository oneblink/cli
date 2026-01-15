import { URLPattern } from 'url'
import type { RouteConfiguration } from './types.js'

import BmResponse from './bm-response.js'
import {
  OneBlinkAPIHostingHandler,
  OneBlinkAPIHostingRequest,
  OneBlinkAPIHostingResponse,
} from '../../index.js'

export const ENTRY_FUNCTION = 'handler'

async function executeHandler<In = void, Out = void>(
  handler: OneBlinkAPIHostingHandler<In, Out>,
  request: OneBlinkAPIHostingRequest<In>,
): Promise<OneBlinkAPIHostingResponse<Out>> {
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

async function getHandler<In = void, Out = void>(
  module: string,
  method: string,
): Promise<OneBlinkAPIHostingHandler<In, Out> | void> {
  const handler: { default: any; [key: string]: any } = await import(module)

  if (handler) {
    if (method && typeof handler[method] === 'function') {
      return handler[method]
    } else {
      return handler.default
    }
  }
}

function findRouteConfig(
  route: string,
  routeConfigs: RouteConfiguration[],
): RouteConfiguration {
  const routeConfig = routeConfigs.find((routeConfig) => {
    const urlPattern = new URLPattern({
      pathname: routeConfig.route.replace(/\{([^}]+)\}/g, ':$1'),
    })
    const result = urlPattern.exec(route)
    routeConfig.params = result?.pathname.groups
    return result
  })

  if (!routeConfig) {
    throw new Error(`Route has not been implemented: ${route}`)
  }

  return routeConfig
}

export default {
  ENTRY_FUNCTION,
  findRouteConfig,
  executeHandler,
  getHandler,
}
