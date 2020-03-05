/* @flow */
'use strict'

/* ::
import type {
  BlinkMRCServer,
  BmRequest,
  CorsConfiguration
} from './types.js'

type HapiCorsConfiguration = {
  credentials: boolean,
  exposedHeaders: Array<string>,
  headers: Array<string>,
  maxAge: number,
  origin: Array<string>
}
*/

const Boom = require('boom')
const Hapi = require('hapi')
const pify = require('pify')

const apis = require('./apis.js')
const handlers = require('./handlers.js')
const values = require('./values.js')
const wrapper = require('./wrapper.js')
const variables = require('./variables.js')
const awsRoles = require('./assume-aws-roles.js')

function normaliseHapiCors(
  cors /* : CorsConfiguration | false */,
) /* : HapiCorsConfiguration | false */ {
  if (!cors) {
    return false
  }
  return {
    credentials: cors.credentials,
    exposedHeaders: cors.exposedHeaders,
    headers: cors.headers,
    maxAge: cors.maxAge,
    origin: cors.origins,
  }
}

// return only the pertinent data from a Hapi Request
function normaliseHapiRequest(
  request /* : any */,
  params /* : { [id:string]: string } */,
) /* : BmRequest */ {
  const urlInfo = Object.assign({}, request.url, {
    host: request.info.host,
    hostname: request.info.hostname,
    params,
    protocol: wrapper.protocolFromHeaders(request.headers),
  })
  delete urlInfo.auth
  delete urlInfo.hash
  delete urlInfo.href
  delete urlInfo.path
  delete urlInfo.port
  delete urlInfo.search
  delete urlInfo.slashes
  return {
    body: request.payload,
    headers: request.headers,
    method: request.method,
    route: '',
    url: urlInfo,
  }
}

function startServer(
  tenant /* : Tenant */,
  logger /* : typeof console */,
  options /* : {
    cors: CorsConfiguration | false,
    cwd: string,
    env: string,
    port: string | number
  } */,
  config /* : BlinkMRCServer */,
  blinkMobileIdentity /* : Object */,
  env /* : string */,
) /* : Promise<any> */ {
  return Promise.resolve()
    .then(() => {
      if (config.awsProfile) {
        // set the AWS Profile to be picked up by the AWS JS sdk
        process.env.AWS_PROFILE = config.awsProfile
      } else {
        return blinkMobileIdentity
          .getAccessToken()
          .then(accessToken => {
            return awsRoles.assumeAWSRoleToServeLocally(
              tenant,
              config,
              env,
              accessToken,
            )
          })
          .then(results => {
            // set the AWS environments to be picked up by the AWS JS sdk
            process.env.AWS_ACCESS_KEY_ID = results.accessKeyId
            process.env.AWS_SECRET_ACCESS_KEY = results.secretAccessKey
            process.env.AWS_SESSION_TOKEN = results.sessionToken
          })
      }
    })
    .then(() => {
      options = options || {}
      const server = new Hapi.Server()
      server.connection({ port: options.port })
      server.route({
        config: {
          cors: normaliseHapiCors(options.cors),
        },
        handler(request, reply) {
          // TODO: consider sanitising this input
          const cwd = options.cwd
          const route = request.params.route
          if (!route) {
            reply(Boom.notImplemented('Must supply a route')) // 501
            return
          }

          apis
            .getRouteConfig(cwd, route)
            .catch(err =>
              Promise.reject(
                Boom.boomify(err, {
                  statusCode: 404,
                }),
              ),
            )
            .then(routeConfig => {
              return apis
                .getHandlerConfig(routeConfig, request.method)
                .then(handlerConfig => {
                  const handler = handlerConfig.handler
                  if (typeof handler !== 'function') {
                    reply(
                      Boom.methodNotAllowed(
                        `${request.method.toUpperCase()} method has not been implemented`,
                      ),
                    ) // 405
                    return
                  }
                  const bmRequest = normaliseHapiRequest(
                    request,
                    handlerConfig.params,
                  )
                  bmRequest.route = routeConfig.route
                  return handlers
                    .executeHandler(handler, bmRequest)
                    .then(bmResponse => {
                      const response = reply(null, bmResponse.payload)
                        .code(bmResponse.statusCode)
                        .type('application/json')
                      Object.keys(bmResponse.headers).forEach(key =>
                        response.header(key, bmResponse.headers[key]),
                      )
                    })
                })
            })
            .catch(err => {
              if (!err || !err.isBoom) {
                err = Boom.boomify(err, {
                  statusCode: 500,
                })
              }
              // Want to show customers what went wrong locally for development.
              // Boom hides this message for 500 status codes.
              err.output.payload.message = err.message

              logger.error(err.stack)
              if (err.data) {
                logger.error('Boom Data:', JSON.stringify(err.data, null, 2))
              }
              reply(err)
            })
        },
        // HTTP HEAD is automatically provided based on GET
        method: values.METHODS.filter(method => method !== 'OPTIONS'),
        path: '/{route*}', // catch-all
      })
      return server
        .register({
          register: require('good'),
          options: {
            ops: false,
            reporters: {
              console: [
                {
                  module: 'good-console',
                },
                'stdout',
              ],
            },
          },
        })
        .then(() =>
          variables.setToCurrentProcess(logger, options.cwd, options.env),
        )
        .then(() => pify(server.start.bind(server))())
        .then(() => server)
    })
}

module.exports = {
  normaliseHapiCors,
  normaliseHapiRequest,
  startServer,
}
