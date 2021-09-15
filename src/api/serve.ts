import type OneBlinkAPIClient from '../oneblink-api-client'

import type { BlinkMRCServer } from './types'
import type { APITypes } from '@oneblink/types'

import http from 'http'

import Boom from '@hapi/boom'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import apis from './apis'
import handlers from './handlers'
import variables from './variables'
import awsRoles from './assume-aws-roles'

async function startServer(
  logger: typeof console,
  options: {
    cors: APITypes.APIEnvironmentCorsConfiguration | false
    cwd: string
    env: string
    port: string | number
  },
  config: BlinkMRCServer,
  oneBlinkAPIClient: OneBlinkAPIClient,
  env: string,
): Promise<void> {
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
  let corsConfiguration: Parameters<typeof cors>[0] = { origin: false }
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

  app.use(express.text({ type: '*/*' }))

  // Handler to catch all routes
  app.use(async function (
    req,
    res,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next,
  ): Promise<void> {
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

      // JSON parsing of request payload
      let body = req.body
      if (typeof body === 'string' && req.is('json')) {
        try {
          body = JSON.parse(body)
        } catch (error) {
          throw Boom.boomify(error as Error, {
            statusCode: 400,
            message: 'Could not parse request as JSON',
          })
        }
      }

      const request: APITypes.OneBlinkAPIHostingRequest<undefined> = {
        body,
        // @ts-expect-error headers match
        headers: req.headers,
        method: req.method,
        route: routeConfig.route,
        url: {
          host: `${req.hostname}:${options.port}`,
          hostname: req.hostname,
          params: handlerConfig.params,
          pathname: req.path,
          protocol: 'http:',
          // @ts-expect-error query matches
          query: req.query || {},
        },
      }

      const bmResponse: APITypes.OneBlinkAPIHostingResponse<unknown> = await handlers.executeHandler(
        handler,
        request,
      )

      res
        .status(bmResponse.statusCode)
        .set(bmResponse.headers)
        .send(bmResponse.payload)
    } catch (error: any) {
      let err: Boom.Boom = error
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

      res
        .status(err.output.statusCode)
        .set(err.output.headers)
        .json(err.output.payload)
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

export default {
  startServer,
}
