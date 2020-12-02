/* @flow */
'use strict'

import type OneblinkAPIClient from '../oneblink-api-client'

export type EnvironmentNetworkConfiguration = {
  vpcSubnets: string[],
  vpcSecurityGroups: string[],
}

export type BlinkMRC = {
  server?: BlinkMRCServer,
}

export type BlinkMRCServer = {
  project?: string,
  awsProfile?: string,
  cors?: CorsConfiguration | boolean,
  routes?: Array<RouteConfiguration>,
  timeout?: number,
  variables?: {
    [id: string]:
      | string
      | {
          [id: string]: string,
        },
  },
  network?: {
    [environment: string]: EnvironmentNetworkConfiguration,
  },
  memorySize?: number,
}

export type CLIFlags = {
  cwd: string,
  env: string,
  force: boolean,
  port?: string,
}

export type CLIOptions = {
  oneblinkAPIClient: OneblinkAPIClient,
}

export type CorsConfiguration = {
  credentials: boolean,
  exposedHeaders: Array<string>,
  headers: Array<string>,
  maxAge: number,
  origins: Array<string>,
}

export type HandlerConfiguration<In = void, Out = void> = {
  handler: OneBlinkAPIHostingHandler<In, Out> | void,
  params: {
    [id: string]: string,
  },
}

export type Headers = $PropertyType<OneBlinkAPIHostingRequest<void>, 'headers'>

export type LambdaEvent = {
  body: any,
  headers: Headers,
  httpMethod: string,
  path: string,
  pathParameters: { [id: string]: string },
  queryStringParameters: { [id: string]: string },
  resource: string,
}

export type MapObject = { [id: string]: any }

export type ProjectConfig = {
  load: () => Promise<BlinkMRC>,
  update: ((BlinkMRC) => BlinkMRC) => Promise<BlinkMRC>,
}

export type Protocol = $PropertyType<
  $PropertyType<OneBlinkAPIHostingRequest<void>, 'url'>,
  'protocol',
>

export type RouteConfiguration = {
  route: string,
  module: string,
  timeout: number,
  params?: { [id: string]: string },
}

export type APIEnvironmentRoute = {
  module: string,
  route: string,
}

export type APIEnvironment = {
  apiId: string,
  environment: string,
  lastDeployment: string,
  routes: APIEnvironmentRoute[],
  cors: CorsConfiguration | boolean,
  vpcSecurityGroupIds?: string,
  vpcSubnetIds?: string,
  bmServerVersion?: string,
  status?: 'Warning' | 'Error' | 'Okay' | 'Unknown',
}

export type API = {
  id: string,
  createdAt: string,
  executionIamRole: string,
  vpcSecurityGroupIds?: string,
  vpcSubnetIds?: string,
  links: {
    awsAccounts: string,
    organisations: string,
  },
  environments?: APIEnvironment[],
  whiteListedEmails?: string[],
}

export type AWSAccount = {
  id: string,
  name: string,
  accountNumber: string,
  tenancy: string,
  createdAt: string,
  apiHosting: {
    vpcSecurityGroupIds: string,
    vpcSubnetIds: string,
  },
  isDefault: boolean,
}

export type ServeCredentials = {
  accessKeyId: string,
  secretAccessKey: string,
  sessionToken: string,
}

export type DeploymentCredentials = {
  s3: {
    region: string,
    key: string,
    bucket: string,
  },
  credentials: ServeCredentials,
}

export type APIDeploymentPayload = {
  scope: string,
  env: string,
  s3: {
    region: string,
    key: string,
    bucket: string,
  },
  timeout: number,
  cors: boolean | CorsConfiguration,
  runtime: string,
  handler: string,
  variables: {
    [key: string]: string,
  },
  routes: Array<{
    module: string,
    route: string,
  }>,
  network: ?{
    vpcSubnets: string[],
    vpcSecurityGroups: string[],
  },
  memorySize?: number,
}
