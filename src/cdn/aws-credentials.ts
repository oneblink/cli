import ora from 'ora'

import OneBlinkAPIClient from '../oneblink-api-client'

type AWSCredentials = {
  AccessKeyId: string
  SecretAccessKey: string
  SessionToken: string
}

async function awsCredentials(
  cfg: any,
  env: string,
  oneBlinkAPIClient: OneBlinkAPIClient,
): Promise<any> {
  const spinner = ora({ spinner: 'dots', text: 'Authenticating...' }).start()
  try {
    const body = await oneBlinkAPIClient.postRequest<
      undefined,
      {
        Credentials: AWSCredentials
      }
    >(`/webApps/${cfg.scope}/environments/${env}/credentials`)
    spinner.succeed('Authentication complete!')
    return {
      accessKeyId: body.Credentials.AccessKeyId,
      secretAccessKey: body.Credentials.SecretAccessKey,
      sessionToken: body.Credentials.SessionToken,
    }
  } catch (error) {
    spinner.fail('Authentication failed!')
    throw error
  }
}

export default awsCredentials
