(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wrapper = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* @flow */
'use strict'

const createInternal = require('./utils/internal.js').createInternal

/* ::
import type {Headers} from './types.js'
*/

const internal = createInternal()

class BmResponse {
  constructor() {
    Object.assign(internal(this), {
      headers: {},
      payload: undefined,
      statusCode: 200,
    })
  }

  get headers() /* : Headers */ {
    return Object.assign({}, internal(this).headers)
  }

  get payload() /* : any */ {
    return internal(this).payload
  }

  get statusCode() /* : number */ {
    return internal(this).statusCode
  }

  setHeader(key /* : string */, value /* : string */) /* : BmResponse */ {
    key = key.toLowerCase()
    internal(this).headers[key] = value
    return this
  }

  setPayload(payload /* : any */) /* : BmResponse */ {
    internal(this).payload = payload
    return this
  }

  setStatusCode(code /* : number */) /* : BmResponse */ {
    internal(this).statusCode = code
    return this
  }
}

module.exports = BmResponse

},{"./utils/internal.js":3}],2:[function(require,module,exports){
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

const ENTRY_FUNCTION = 'handler'

function executeHandler(
  handler /* : Handler */,
  request /* : BmRequest */,
) /* : Promise<BmResponse> */ {
  const response = new BmResponse()
  return Promise.resolve()
    .then(() => handler(request, response))
    .then((result) => {
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
    (routeConfig) => routeConfig.route === unilocRoute.name,
  )
  if (!routeConfig) {
    throw new Error(`Route has not been implemented: ${route}`)
  }

  routeConfig.params = unilocRoute.options
  return routeConfig
}

module.exports = {
  ENTRY_FUNCTION,
  findRouteConfig,
  executeHandler,
  getHandler,
}

},{"./bm-response.js":1,"uniloc":5}],3:[function(require,module,exports){
/* @flow */

/* :: import type { MapObject } from '../types.js' */

// https://developer.mozilla.org/en-US/Add-ons/SDK/Guides/Contributor_s_Guide/Private_Properties

// simpler than alternative: https://www.npmjs.com/package/namespace

function createInternal() {
  const map /* : WeakMap<Object, MapObject> */ = new WeakMap()
  return (object /* : Object */) /* : MapObject */ => {
    const values = map.get(object) || {}
    if (!map.has(object)) {
      map.set(object, values)
    }
    return values
  }
}

module.exports = {
  createInternal,
}

},{}],4:[function(require,module,exports){
/* @flow */
'use strict'

/* ::
import type {
  BmRequest,
  Headers,
  MapObject,
  Protocol
} from './types'
*/

function keysToLowerCase(object /* : MapObject */) /* : MapObject */ {
  return Object.keys(object).reduce((result, key) => {
    result[key.toLowerCase()] = object[key]
    return result
  }, {})
}

function normaliseMethod(method /* : string */) /* : string */ {
  return method.toLowerCase()
}

/**
https://www.w3.org/TR/url-1/#dom-urlutils-protocol
protocol ends with ':', same as in Node.js 'url' module
https://en.wikipedia.org/wiki/List_of_HTTP_header_fields
*/
function protocolFromHeaders(headers /* : Headers */) /* : Protocol */ {
  if (headers['x-forwarded-proto'] === 'https') {
    return 'https:'
  }
  if (
    typeof headers.forwarded === 'string' &&
    ~headers.forwarded.indexOf('proto=https')
  ) {
    return 'https:'
  }
  if (headers['front-end-https'] === 'on') {
    return 'https:'
  }
  return 'http:'
}

module.exports = {
  keysToLowerCase,
  normaliseMethod,
  protocolFromHeaders,
}

},{}],5:[function(require,module,exports){
(function(root) {
  function assert(condition, format) {
    if (!condition) {
      var args = [].slice.call(arguments, 2);
      var argIndex = 0;
      throw new Error(
        'Unirouter Assertion Failed: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }
  }

  function pathParts(path) {
    return path == '' ? [] : path.split('/')
  }

  function routeParts(route) {
    var split = route.split(/\s+/)
    var method = split[0]
    var path = split[1]

    // Validate route format
    assert(
      split.length == 2,
      "Route `%s` separates method and path with a single block of whitespace", route
    )

    // Validate method format
    assert(
      /^[A-Z]+$/.test(method),
      "Route `%s` starts with an UPPERCASE method", route
    )

    // Validate path format
    assert(
      !/\/{2,}/.test(path),
      "Path `%s` has no adjacent `/` characters: `%s`", path
    )
    assert(
      path[0] == '/',
      "Path `%s` must start with the `/` character", path
    )
    assert(
      path == '/' || !/\/$/.test(path),
      "Path `%s` does not end with the `/` character", path
    )
    assert(
      path.indexOf('#') === -1 && path.indexOf('?') === -1,
      "Path `%s` does not contain the `#` or `?` characters", path
    )

    return pathParts(path.slice(1)).concat(method)
  }


  function LookupTree() {
    this.tree = {}
  }

  function lookupTreeReducer(tree, part) {
    return tree && (tree[part] || tree[':'])
  }

  LookupTree.prototype.find = function(parts) {
    return (parts.reduce(lookupTreeReducer, this.tree) || {})['']
  }

  LookupTree.prototype.add = function(parts, route) {
    var i, branch
    var branches = parts.map(function(part) { return part[0] == ':' ? ':' : part })
    var currentTree = this.tree

    for (i = 0; i < branches.length; i++) {
      branch = branches[i]  
      if (!currentTree[branch]) {
        currentTree[branch] = {}
      }
      currentTree = currentTree[branch]
    }

    assert(
      !currentTree[branch],
      "Path `%s` conflicts with another path", parts.join('/')
    )

    currentTree[''] = route
  }


  function createRouter(routes, aliases) {
    var parts, name, route;
    var routesParams = {};
    var lookupTree = new LookupTree;

    // By default, there are no aliases
    aliases = aliases || {};

    // Copy routes into lookup tree
    for (name in routes) {
      if (routes.hasOwnProperty(name)) {
        route = routes[name]

        assert(
          typeof route == 'string',
          "Route '%s' must be a string", name
        )
        assert(
          name.indexOf('.') == -1,
          "Route names must not contain the '.' character", name
        )

        parts = routeParts(route)

        routesParams[name] = parts
          .map(function(part, i) { return part[0] == ':' && [part.substr(1), i] })
          .filter(function(x) { return x })

        lookupTree.add(parts, name)
      }
    }

    // Copy aliases into lookup tree
    for (route in aliases) {
      if (aliases.hasOwnProperty(route)) {
        name = aliases[route]

        assert(
          routes[name],
          "Alias from '%s' to non-existent route '%s'.", route, name
        )

        lookupTree.add(routeParts(route), name);
      }
    }


    return {
      lookup: function(uri, method) {
        method = method ? method.toUpperCase() : 'GET'

        var i, x

        var split = uri
          // Strip leading and trailing '/' (at end or before query string)
          .replace(/^\/|\/($|\?)/g, '')
          // Strip fragment identifiers
          .replace(/#.*$/, '')
          .split('?', 2)

        var parts = pathParts(split[0]).map(decodeURIComponent).concat(method)
        var name = lookupTree.find(parts)
        var options = {}
        var params, queryParts

        params = routesParams[name] || []
        queryParts = split[1] ? split[1].split('&') : []
      
        for (i = 0; i != queryParts.length; i++) {
          x = queryParts[i].split('=')
          options[x[0]] = decodeURIComponent(x[1])
        }

        // Named parameters overwrite query parameters
        for (i = 0; i != params.length; i++) {
          x = params[i]
          options[x[0]] = parts[x[1]]
        }

        return {name: name, options: options}
      },


      generate: function(name, options) {
        options = options || {}

        var params = routesParams[name] || []
        var paramNames = params.map(function(x) { return x[0]; })
        var route = routes[name]
        var query = []
        var inject = []
        var key

        assert(route, "No route with name `%s` exists", name)

        var path = route.split(' ')[1]

        for (key in options) {
          if (options.hasOwnProperty(key)) {
            if (paramNames.indexOf(key) === -1) {
              assert(
                /^[a-zA-Z0-9-_]+$/.test(key),
                "Non-route parameters must use only the following characters: A-Z, a-z, 0-9, -, _"
              )

              query.push(key+'='+encodeURIComponent(options[key]))
            }
            else {
              inject.push(key)
            }
          }
        }

        assert(
          inject.sort().join() == paramNames.slice(0).sort().join(),
          "You must specify options for all route params when using `uri`."
        )

        var uri =
          paramNames.reduce(function pathReducer(injected, key) {
            return injected.replace(':'+key, encodeURIComponent(options[key]))
          }, path)

        if (query.length) {
          uri += '?' + query.join('&')
        }

        return uri
      }
    };
  }


  if (typeof module !== 'undefined' && module.exports) {
    module.exports = createRouter
  }
  else {
    root.unirouter = createRouter
  }
})(this);

},{}],6:[function(require,module,exports){
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

module.exports = {
  [handlers.ENTRY_FUNCTION]: handler,
  normaliseLambdaRequest,
}
/* eslint-enable no-console */

},{"../lib/api/handlers.js":2,"../lib/api/wrapper.js":4,"https":undefined,"path":undefined,"querystring":undefined,"url":undefined}]},{},[6])(6)
});
