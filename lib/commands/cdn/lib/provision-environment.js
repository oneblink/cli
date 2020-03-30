/* @flow */
'use strict'

/* ::
import OneBlinkAPIClient from '../../../oneblink-api-client'
*/

const chalk = require('chalk')
const ora = require('ora')

async function provisionEnvironment(
  cfg /* : Object */,
  env /* : string */,
  oneBlinkAPIClient /* : OneBlinkAPIClient */,
) /* : Promise<void> */ {
  const spinner = ora({
    spinner: 'dots',
    text: `Provisioning environment "${env}"...`,
  }).start()
  try {
    const body = await oneBlinkAPIClient.postRequest(
      `/webApps/${cfg.scope}/environments/${env}/deployments`,
    )
    spinner.succeed(
      'Deployment complete - Origin: ' + chalk.bold(body.brandedUrl),
    )
  } catch (error) {
    spinner.fail(`Provisioning environment "${env}" failed!`)
    throw error
  }
}

module.exports = provisionEnvironment
