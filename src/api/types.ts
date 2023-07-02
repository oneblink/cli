import type OneblinkAPIClient from '../oneblink-api-client.js'
import { APITypes } from '@oneblink/types'
import {
  OneBlinkAPIHostingHandler,
  OneBlinkAPIHostingRequest,
} from '../../index.js'

export type BlinkMRC = {
  server?: BlinkMRCServer
}

export type BlinkMRCServer = {
  project?: string
  awsProfile?: string
  cors?: APITypes.APIEnvironmentCorsConfiguration | boolean
  routes?: Array<APITypes.APIEnvironmentRoute>
  timeout?: number
  variables?: {
    [key: string]:
      | string
      | {
          [key: string]: string
        }
  }
  network?: {
    [environment: string]: APITypes.APIEnvironmentNetworkConfiguration
  }
  scheduledFunctions?: Array<APITypes.APIDeploymentPayloadScheduledFunction>
  memorySize?: number
}

export type CLIFlags = {
  cwd: string
  env: string
  force: boolean
  port?: string
}

export type CLIOptions = {
  oneblinkAPIClient: OneblinkAPIClient
}

export type HandlerConfiguration<In = void, Out = void> = {
  handler: OneBlinkAPIHostingHandler<In, Out> | void
  params: {
    [id: string]: string
  }
}

export type Headers = OneBlinkAPIHostingRequest['headers']

export type LambdaEvent =
  | {
      version?: '1.0'
      body: unknown
      headers: Headers
      httpMethod: string
      path: string
      pathParameters: Record<string, string> | null
      queryStringParameters: Record<string, string> | null
      multiValueQueryStringParameters: Record<string, string[]> | null
    }
  | {
      version: '2.0'
      body: unknown
      headers: Headers
      requestContext: {
        http: {
          method: string
        }
      }
      rawPath: string
      pathParameters: Record<string, string> | null
      rawQueryString: string | null
      queryStringParameters: Record<string, string> | null
    }

export type MapObject = Record<string, any>

export type ProjectConfig = {
  load: () => Promise<BlinkMRC>
  update: (fn: (config: BlinkMRC) => BlinkMRC) => Promise<BlinkMRC>
}

export type Protocol = OneBlinkAPIHostingRequest['url']['protocol']

export type RouteConfiguration = APITypes.APIEnvironmentRoute & {
  timeout?: number
  params?: { [id: string]: string }
}

export type ScheduledFunctionConfiguration =
  APITypes.APIDeploymentPayloadScheduledFunction & {
    timeout?: number
  }

export type ServeCredentials = {
  accessKeyId: string
  secretAccessKey: string
  sessionToken: string
}

export type DeploymentCredentials = {
  s3: {
    region: string
    key: string
    bucket: string
  }
  credentials: ServeCredentials
}
