import type OneblinkAPIClient from '../oneblink-api-client'
import { APITypes } from '@oneblink/types'

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
  handler: APITypes.OneBlinkAPIHostingHandler<In, Out> | void
  params: {
    [id: string]: string
  }
}

export type Headers = APITypes.OneBlinkAPIHostingRequest['headers']

export type LambdaEvent =
  | {
      version?: '1.0'
      body: unknown
      headers: Headers
      httpMethod: string
      path: string
      pathParameters: { [id: string]: string } | null
      queryStringParameters: { [id: string]: string } | null
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
      pathParameters: { [id: string]: string } | null
      queryStringParameters: { [id: string]: string } | null
    }

export type MapObject = Record<string, any>

export type ProjectConfig = {
  load: () => Promise<BlinkMRC>
  update: (fn: (config: BlinkMRC) => BlinkMRC) => Promise<BlinkMRC>
}

export type Protocol = APITypes.OneBlinkAPIHostingRequest['url']['protocol']

export type RouteConfiguration = APITypes.APIEnvironmentRoute & {
  timeout?: number
  params?: { [id: string]: string }
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
