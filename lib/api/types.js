/* @flow */
'use strict'

/* ::
import type BmResponse from './bm-response.js'
import type OneBlinkIdentity from '../identity'
*/

/* ::
export type EnvironmentNetworkConfiguration = {
  vpcSubnets: string[],
  vpcSecurityGroups: string[]
}

export type BlinkMRC = {
  server?: BlinkMRCServer
}

export type BlinkMRCServer = {
  project?: string,
  tenant?: string,
  awsProfile?: string,
  cors?: CorsConfiguration | boolean,
  routes?: Array<RouteConfiguration>,
  timeout?: number,
  analytics?: {
    key: string,
    secret: string,
    origin?: string
  },
  variables?: {
    [id:string]: string | {
      [id:string]: string
    }
  },
  network?: {
    [environment: string]: EnvironmentNetworkConfiguration
  }
}

export type BmRequest = {
  body: any,
  headers: Headers,
  method: string,
  route: string,
  url: {
    host: string,
    hostname: string,
    params: { [id:string]: string },
    pathname: string,
    protocol: Protocol,
    query: { [id:string]: string }
  }
}

export type CLIFlags = {
  provision: boolean,
  bmServerVersion: string,
  deploymentBucket?: string,
  cwd: string,
  env: string,
  executionRole?: string,
  filter?: string,
  force: boolean,
  out?: string,
  port?: string,
  startTime?: string,
  tail: boolean,
  vpcSecurityGroups?: string,
  vpcSubnets?: string,
  analyticsCollectorToken?: string,
  analyticsOrigin?: string
}

export type AnalyticsConfig = {
  collectorToken: string | void,
  origin: string | void
}

export type CLIOptions = {
  blinkMobileIdentity: OneBlinkIdentity
}

export type CorsConfiguration = {
  credentials: boolean,
  exposedHeaders: Array<string>,
  headers: Array<string>,
  maxAge: number,
  origins: Array<string>
}

export type Handler = (BmRequest, BmResponse) => any

export type HandlerConfiguration = {
  handler: Handler | void,
  params: {
    [id:string]: string
  }
}

export type Headers = {
  [id:string]: string | boolean
}

export type LambdaEvent = {
  body: any,
  headers: Headers,
  httpMethod: string,
  path: string,
  pathParameters: { [id:string]: string },
  queryStringParameters: { [id:string]: string },
  resource: string
}

export type MapObject = { [id:string]: any }

export type ProjectConfig = {
  load: () => Promise<BlinkMRC>,
  update: ((BlinkMRC) => BlinkMRC) => Promise<BlinkMRC>
}

export type Protocol = 'http:' | 'https:'

export type RouteConfiguration = {
  route: string,
  module: string,
  timeout: number,
  params?: {[id:string]: string}
}

export type APIEnvironmentRoute = {
  module: string,
  route: string
}

export type APIEnvironment = {
  apiId: string,
  environment: string,
  lastDeployment: string,
  routes: APIEnvironmentRoute[],
  cors: Object | boolean,
  vpcSecurityGroupIds?: string,
  vpcSubnetIds?: string,
  bmServerVersion?: string,
  status?: 'Warning' | 'Error' | 'Okay' | 'Unknown'
}

export type API = {
  id: string,
  createdAt: string,
  executionIamRole: string,
  vpcSecurityGroupIds?: string,
  vpcSubnetIds?: string,
  links: {
    awsAccounts: string,
    organisations: string
  },
  environments?: APIEnvironment[],
  whiteListedEmails?: string[]
}

export type AWSAccount = {
  id: string,
  name: string,
  accountNumber: string,
  tenancy: string,
  createdAt: string,
  apiHosting: {
    vpcSecurityGroupIds: string,
    vpcSubnetIds: string
  },
  isDefault: boolean
}
*/
// eslint-disable-next-line no-multiple-empty-lines

