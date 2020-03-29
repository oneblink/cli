/* eslint-disable no-console */

/**
This module exports a "handler" function,
that wraps a customer function.
We bundle this module and its dependencies to ../dist/wrapper.js .
To bundle: `npm run build`
*/
/* @flow */
'use strict'

/* ::
import type {
  BmRequest,
  Headers,
  LambdaEvent
} from '../lib/api/types.js'

type APIGatewayResult = {
  statusCode: number,
  headers: Headers,
  body?: string
}
*/

const https = require('https')
const { URL } = require('url')
const path = require('path')
const querystring = require('querystring')

const handlers = require('../lib/api/handlers.js')
const wrapper = require('../lib/api/wrapper.js')

// return only the pertinent data from a API Gateway + Lambda event
function normaliseLambdaRequest(event /* : LambdaEvent */) /* : BmRequest */ {
  const headers = wrapper.keysToLowerCase(event.headers)
  let body = event.body
  try {
    body = JSON.parse(body)
  } catch (e) {
    // Do nothing...
  }
  const host = headers['x-forwarded-host'] || headers.host
  return {
    body,
    headers,
    method: wrapper.normaliseMethod(event.httpMethod),
    route: event.path,
    url: {
      host,
      hostname: host,
      params: {},
      pathname: event.path,
      protocol: wrapper.protocolFromHeaders(headers),
      query: event.queryStringParameters || {},
    },
  }
}

async function handler(
  event /* : LambdaEvent */,
  context /* : any */,
) /* : Promise<APIGatewayResult> */ {
  const startTime = Date.now()
  context.callbackWaitsForEmptyEventLoop = false

  const request = normaliseLambdaRequest(event)
  const internalHeaders /* : Headers */ = {
    'Content-Type': 'application/json',
  }

  // $FlowFixMe requiring file without string literal to accommodate for __dirname
  const config = require(path.join(__dirname, 'bm-server.json'))

  const finish = (
    statusCode /* : number */,
    body /* : mixed | void */,
    customHeaders /* : Headers | void */,
  ) /* : APIGatewayResult */ => {
    const headers = wrapper.keysToLowerCase(
      Object.assign(internalHeaders, customHeaders),
    )
    const endTime = Date.now()
    const requestTime = endTime - startTime

    if (
      process.env.ONEBLINK_ANALYTICS_ORIGIN &&
      process.env.ONEBLINK_ANALYTICS_COLLECTOR_TOKEN
    ) {
      try {
        const token = process.env.ONEBLINK_ANALYTICS_COLLECTOR_TOKEN
        const hostname = new URL(process.env.ONEBLINK_ANALYTICS_ORIGIN).hostname
        const httpsRequest = https.request({
          hostname,
          path: '/events',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        httpsRequest.write(
          JSON.stringify({
            events: [
              {
                name: 'Server CLI Request',
                date: new Date().toISOString(),
                tags: {
                  env: config.env,
                  scope: config.scope,
                  request: {
                    method: request.method.toUpperCase(),
                    query: request.url.query,
                    port: 443,
                    path: request.route,
                    hostName: request.url.hostname,
                    params: request.url.params,
                    protocol: request.url.protocol,
                  },
                  response: {
                    statusCode: statusCode,
                  },
                  requestTime: {
                    startDateTime: new Date(startTime).toISOString(),
                    startTimeStamp: startTime,
                    endDateTime: new Date(endTime).toISOString(),
                    endTimeStamp: endTime,
                    ms: requestTime,
                    s: requestTime / 1000,
                  },
                },
              },
            ],
          }),
        )
        httpsRequest.end()
      } catch (e) {
        console.warn('An error occurred attempting to POST analytics event', e)
      }
    }

    let path = request.url.pathname
    const search = querystring.stringify(request.url.query)
    if (search) {
      path += `?${search}`
    }
    let referrer = request.headers.referrer
    if (typeof referrer !== 'string' || !referrer) {
      referrer = '-'
    }
    let userAgent = request.headers['user-agent']
    if (typeof userAgent !== 'string' || !userAgent) {
      userAgent = '-'
    }
    console.log(
      `${request.method.toUpperCase()} ${path}${querystring.stringify(
        request.url.query,
      )} ${statusCode} "${requestTime} ms" "${referrer}" "${userAgent}"`,
    )

    const result /* : APIGatewayResult */ = {
      headers: headers,
      statusCode: statusCode,
    }
    if (body !== undefined) {
      result.body = typeof body === 'string' ? body : JSON.stringify(body)
    }
    return result
  }

  try {
    // Get handler module based on route
    let routeConfig
    try {
      routeConfig = handlers.findRouteConfig(event.path, config.routes)
      request.url.params = routeConfig.params || {}
      request.route = routeConfig.route
    } catch (error) {
      return finish(404, {
        error: 'Not Found',
        message: error.message,
        statusCode: 404,
      })
    }

    // Check for browser requests and apply CORS if required
    if (request.headers.origin) {
      if (!config.cors) {
        // No cors, we will return 405 result and let browser handler error
        return finish(405, {
          error: 'Method Not Allowed',
          message: 'OPTIONS method has not been implemented',
          statusCode: 405,
        })
      }
      if (
        !config.cors.origins.some(
          (origin) => origin === '*' || origin === request.headers.origin,
        )
      ) {
        // Invalid origin, we will return 200 result and let browser handler error
        return finish(200)
      }
      // Headers for all cross origin requests
      internalHeaders['Access-Control-Allow-Origin'] = request.headers.origin
      internalHeaders[
        'Access-Control-Expose-Headers'
      ] = config.cors.exposedHeaders.join(',')
      // Headers for OPTIONS cross origin requests
      if (
        request.method === 'options' &&
        request.headers['access-control-request-method']
      ) {
        internalHeaders[
          'Access-Control-Allow-Headers'
        ] = config.cors.headers.join(',')
        internalHeaders['Access-Control-Allow-Methods'] =
          request.headers['access-control-request-method']
        internalHeaders['Access-Control-Max-Age'] = config.cors.maxAge
      }
      // Only set credentials header if truthy
      if (config.cors.credentials) {
        internalHeaders['Access-Control-Allow-Credentials'] = true
      }
    }
    if (request.method === 'options') {
      // For OPTIONS requests, we can just finish
      // as we have created our own implementation of CORS
      return finish(200)
    }

    // Change current working directory to the project
    // to accommodate for packages using process.cwd()
    const projectPath = path.join(__dirname, 'project')
    if (process.cwd() !== projectPath) {
      try {
        process.chdir(projectPath)
      } catch (err) {
        throw new Error(
          `Could not change current working directory to '${projectPath}': ${err}`,
        )
      }
    }

    const handler = await handlers.getHandler(
      path.join(__dirname, routeConfig.module),
      request.method,
    )
    if (typeof handler !== 'function') {
      return finish(405, {
        error: 'Method Not Allowed',
        message: `${request.method.toUpperCase()} method has not been implemented`,
        statusCode: 405,
      })
    }

    const response = await handlers.executeHandler(handler, request)
    return finish(response.statusCode, response.payload, response.headers)
  } catch (error) {
    if (
      error &&
      error.isBoom &&
      error.output &&
      error.output.payload &&
      error.output.statusCode
    ) {
      if (error.data) {
        console.error(error, JSON.stringify(error.data))
      } else {
        console.error(error)
      }
      return finish(
        error.output.statusCode,
        error.output.payload,
        error.output.headers,
      )
    }

    console.error(error)
    return finish(500, {
      error: 'Internal Server Error',
      message: 'An internal server error occurred',
      statusCode: 500,
    })
  }
}

const ENTRY_FUNCTION = 'handler'

module.exports = {
  ENTRY_FUNCTION,
  [ENTRY_FUNCTION]: handler,
  normaliseLambdaRequest,
}
/* eslint-enable no-console */
