/**
This module exports a "handler" function,
that wraps a customer function.
We bundle this module and its dependencies to "dist".
To bundle: `npm run build`
*/

import process from 'process'
import path from 'path'
import { URLSearchParams, fileURLToPath, URL } from 'url'

import handlers from '../handlers.js'
import wrapper from '../wrapper.js'
import type { Headers, LambdaEvent } from '../types.js'
import type { OneBlinkAPIHostingRequest } from '../../../index.js'

type APIGatewayResult = {
  statusCode: number
  headers: Headers
  body?: string
}

const __dirname = fileURLToPath(new URL('.', import.meta.url))

function generateURLSearchParams(event: LambdaEvent): URLSearchParams {
  if (event.version === '2.0') {
    return new URLSearchParams(event.rawQueryString || '')
  }
  const options = Object.entries(
    event.multiValueQueryStringParameters || {},
  ).reduce<readonly [string, string][]>(
    (memo, [key, values]) => [
      ...memo,
      ...values.map((value) => [key, value] as [string, string]),
    ],
    [],
  )
  return new URLSearchParams(options)
}

// return only the pertinent data from a API Gateway + Lambda event
function normaliseLambdaRequest<T>(
  event: LambdaEvent,
): OneBlinkAPIHostingRequest<T> {
  const headers = wrapper.keysToLowerCase(event.headers)
  let body = event.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      // Do nothing...
    }
  }
  const path = event.version === '2.0' ? event.rawPath : event.path
  const host = headers['x-forwarded-host'] || headers.host
  const urlSearchParams = generateURLSearchParams(event)
  const query: OneBlinkAPIHostingRequest['url']['query'] = {}
  urlSearchParams.forEach((value, key) => {
    const existingValue = query[key]
    if (typeof existingValue === 'string') {
      query[key] = [existingValue, value]
    } else if (Array.isArray(existingValue)) {
      query[key] = [...existingValue, value]
    } else {
      query[key] = value
    }
  })
  return {
    body: body as T,
    headers,
    method: wrapper.normaliseMethod(
      event.version === '2.0'
        ? event.requestContext.http.method
        : event.httpMethod,
    ),
    route: path,
    url: {
      host,
      hostname: host,
      params: {},
      pathname: path,
      protocol: wrapper.protocolFromHeaders(headers),
      query,
      querystring: urlSearchParams.toString(),
    },
  }
}

async function handler(
  event: LambdaEvent,
  context: any,
): Promise<APIGatewayResult> {
  const startTime = Date.now()
  context.callbackWaitsForEmptyEventLoop = false

  const request = normaliseLambdaRequest<undefined>(event)
  const internalHeaders: Headers = {
    'Content-Type': 'application/json',
  }
  const { default: config } = await import(
    path.join(__dirname, 'bm-server.json'),
    {
      with: { type: 'json' },
    }
  )

  const finish = (
    statusCode: number,
    body: unknown | undefined,
    customHeaders: Headers | void,
  ): APIGatewayResult => {
    const headers = wrapper.keysToLowerCase(
      Object.assign(internalHeaders, customHeaders),
    )
    const endTime = Date.now()
    const requestTime = endTime - startTime

    let path = request.url.pathname
    const urlSearchParams = new URLSearchParams(request.url.querystring)
    const querystring = urlSearchParams.toString()
    if (querystring) {
      path += `?${querystring}`
    }
    let referer = request.headers.referer
    if (typeof referer !== 'string' || !referer) {
      referer = '-'
    }
    let userAgent = request.headers['user-agent']
    if (typeof userAgent !== 'string' || !userAgent) {
      userAgent = '-'
    }
    console.log(
      `${request.method.toUpperCase()} ${path} ${statusCode} "${requestTime} ms" "${referer}" "${userAgent}"`,
    )

    const result: APIGatewayResult = {
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
      routeConfig = handlers.findRouteConfig(request.route, config.routes)
      request.url.params = routeConfig.params || {}
      request.route = routeConfig.route
    } catch (error) {
      return finish(404, {
        error: 'Not Found',
        message: (error as Error).message,
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
          (origin: any) => origin === '*' || origin === request.headers.origin,
        )
      ) {
        // Invalid origin, we will return 200 result and let browser handler error
        return finish(200, undefined, undefined)
      }
      // Headers for all cross origin requests
      internalHeaders['Access-Control-Allow-Origin'] = request.headers.origin
      internalHeaders['Access-Control-Expose-Headers'] =
        config.cors.exposedHeaders.join(',')
      // Headers for OPTIONS cross origin requests
      if (
        request.method === 'options' &&
        request.headers['access-control-request-method']
      ) {
        internalHeaders['Access-Control-Allow-Headers'] =
          config.cors.headers.join(',')
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
      return finish(200, undefined, undefined)
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
      typeof error === 'object' &&
      'isBoom' in error &&
      'output' in error &&
      error.output &&
      typeof error.output === 'object' &&
      'payload' in error.output &&
      error.output.payload &&
      'statusCode' in error.output &&
      typeof error.output.statusCode === 'number'
    ) {
      if ('data' in error && error.data) {
        console.error(error, JSON.stringify(error.data))
      } else {
        console.error(error)
      }
      return finish(
        error.output.statusCode,
        error.output.payload,
        'headers' in error.output
          ? (error.output.headers as Headers)
          : undefined,
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

export { handler, normaliseLambdaRequest }
