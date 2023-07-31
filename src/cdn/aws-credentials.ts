import ora from 'ora'

import OneBlinkAPIClient from '../oneblink-api-client.js'
import { AWSTypes } from '@oneblink/types'

export default async function awsCredentials(
  cfg: any,
  env: string,
  oneBlinkAPIClient: OneBlinkAPIClient,
): Promise<AWSTypes.AWSCredentials> {
  const spinner = ora({ spinner: 'dots', text: 'Authenticating...' }).start()
  try {
    const body = await oneBlinkAPIClient.postRequest<
      undefined,
      {
        Credentials: AWSTypes.AWSCredentials
      }
    >(`/v2/webApps/${cfg.scope}/environments/${env}/credentials`)
    spinner.succeed('Authentication complete!')
    return body.Credentials
  } catch (error) {
    spinner.fail('Authentication failed!')
    throw error
  }
}
