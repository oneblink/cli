import type OneBlinkAPIClient from '../oneblink-api-client'

import type {
  BlinkMRCServer,
  DeploymentCredentials,
  ServeCredentials,
} from './types'

async function assumeAWSRole<T>(
  oneBlinkAPIClient: OneBlinkAPIClient,
  pathname: string,
): Promise<T> {
  return oneBlinkAPIClient.postRequest(pathname)
}

async function assumeAWSRoleToDeploy(
  oneBlinkAPIClient: OneBlinkAPIClient,
  config: BlinkMRCServer,
  env: string,
): Promise<DeploymentCredentials> {
  const { credentials, s3 } = await assumeAWSRole(
    oneBlinkAPIClient,
    `/v3/apis/${config.project || ''}/environments/${env}/credentials/deploy`,
  )

  return {
    s3,
    credentials: {
      accessKeyId: credentials.AccessKeyId,
      secretAccessKey: credentials.SecretAccessKey,
      sessionToken: credentials.SessionToken,
    },
  }
}

async function assumeAWSRoleToServeLocally(
  oneBlinkAPIClient: OneBlinkAPIClient,
  config: BlinkMRCServer,
  env: string,
): Promise<ServeCredentials> {
  const { Credentials } = await assumeAWSRole(
    oneBlinkAPIClient,
    `/apis/${config.project || ''}/environments/${env}/credentials/serve`,
  )
  return {
    accessKeyId: Credentials.AccessKeyId,
    secretAccessKey: Credentials.SecretAccessKey,
    sessionToken: Credentials.SessionToken,
  }
}

export default {
  assumeAWSRoleToDeploy,
  assumeAWSRoleToServeLocally,
}
