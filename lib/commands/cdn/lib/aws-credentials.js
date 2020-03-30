/* @flow */
'use strict'

/* ::
import OneBlinkAPIClient from '../../../oneblink-api-client'
*/

const ora = require('ora')

async function awsCredentials(
  cfg /* : Object */,
  env /* : string */,
  oneBlinkAPIClient /* : OneBlinkAPIClient */,
) /* : Promise<Object> */ {
  const spinner = ora({ spinner: 'dots', text: 'Authenticating...' }).start()
  try {
    const body = await oneBlinkAPIClient.postRequest(
      `/webApps/${cfg.scope}/environments/${env}/credentials`,
    )
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

module.exports = awsCredentials
