/* @flow */
'use strict'

/* ::
import type OneBlinkAPIClient from '../oneblink-api-client'

import type {
  BlinkMRCServer,
  BmRequest,
  CorsConfiguration
} from './types.js'

import type {
  $Request,
  $Response,
  NextFunction
} from 'express'

*/

const http = require('http')

const Boom = require('@hapi/boom')
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')

const apis = require('./apis.js')
const handlers = require('./handlers.js')
const wrapper = require('./wrapper.js')
const variables = require('./variables.js')
const awsRoles = require('./assume-aws-roles.js')

async function startServer(
  tenant /* : Tenant */,
  logger /* : typeof console */,
  options /* : {
    cors: CorsConfiguration | false,
    cwd: string,
    env: string,
    port: string | number
  } */,
  config /* : BlinkMRCServer */,
  oneBlinkAPIClient /* : OneBlinkAPIClient */,
  env /* : string */,
) /* : Promise<void> */ {
  if (config.awsProfile) {
    // set the AWS Profile to be picked up by the AWS JS sdk
    process.env.AWS_PROFILE = config.awsProfile
  } else {
    const results = await awsRoles.assumeAWSRoleToServeLocally(
      oneBlinkAPIClient,
      config,
      env,
    )
    // set the AWS environments to be picked up by the AWS JS sdk
    process.env.AWS_ACCESS_KEY_ID = results.accessKeyId
    process.env.AWS_SECRET_ACCESS_KEY = results.secretAccessKey
    process.env.AWS_SESSION_TOKEN = results.sessionToken
  }

  await variables.setToCurrentProcess(logger, options.cwd, options.env)

  const app = express()

  app.use(morgan('dev'))

  // Cors
  let corsConfiguration = { origin: false }
  if (options.cors) {
    corsConfiguration = {
      credentials: options.cors.credentials,
      exposedHeaders: options.cors.exposedHeaders,
      allowedHeaders: options.cors.headers,
      maxAge: options.cors.maxAge,
      origin: options.cors.origins,
    }
  }
  app.use(cors(corsConfiguration))

  // JSON parsing of request payload
  // $FlowIssue
  app.use(express.json())

  // Handler to catch all routes
  app.use(async function (
    req /* : $Request */,
    res /* : $Response */,
    // eslint-disable-next-line no-unused-vars
    next /* : NextFunction */,
  ) /* : Promise<void> */ {
    try {
      const routeConfig = await apis
        .getRouteConfig(options.cwd, req.path)
        .catch((err) => {
          throw Boom.boomify(err, {
            statusCode: 404,
          })
        })

      const handlerConfig = await apis.getHandlerConfig(
        routeConfig,
        req.method.toLowerCase(),
      )
      const handler = handlerConfig.handler
      if (typeof handler !== 'function') {
        throw Boom.methodNotAllowed(
          `${req.method.toUpperCase()} method has not been implemented`,
        )
      }

      const bmResponse = await handlers.executeHandler(handler, {
        body: req.body,
        headers: req.headers,
        method: req.method,
        route: routeConfig.route,
        url: {
          host: `${req.hostname}:${options.port}`,
          hostname: req.hostname,
          params: handlerConfig.params,
          pathname: req.path,
          protocol: wrapper.protocolFromHeaders(req.headers),
          query: req.query || {},
        },
      })

      res
        .status(bmResponse.statusCode)
        .json(bmResponse.payload)
        .set(bmResponse.headers)
    } catch (error) {
      let err = error
      // The express.json() middleware will throw an SyntaxError if the request
      // payload could not be parsed as JSON. This middleware will only kick in
      // if the Content-Type request header is set to application/json, however
      // there is chance users could set that header and not valid JSON so we will
      // catch that error here
      if (error && error.name === 'SyntaxError') {
        err = Boom.boomify(error, {
          statusCode: 400,
          message: 'Could not parse request',
        })
      }

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

      res.status(err.output.statusCode)
      res.json(err.output.payload)
    }
  })

  // Create HTTP server.
  const server = http.createServer(app)

  // Listen on provided port, on all network interfaces.
  server.listen(options.port)

  await new Promise((resolve, reject) => {
    server.on('listening', resolve)
    server.on('error', reject)
  })
}

module.exports = {
  startServer,
}
