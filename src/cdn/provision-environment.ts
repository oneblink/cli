import OneBlinkAPIClient from '../oneblink-api-client.js'

import chalk from 'chalk'
import ora from 'ora'

async function provisionEnvironment(
  cfg: any,
  env: string,
  oneBlinkAPIClient: OneBlinkAPIClient,
): Promise<void> {
  const spinner = ora({
    spinner: 'dots',
    text: `Provisioning environment "${env}"...`,
  }).start()
  try {
    const body = await oneBlinkAPIClient.postRequest<
      undefined,
      { brandedUrl: string }
    >(`/webApps/${cfg.scope}/environments/${env}/deployments`)
    spinner.succeed(
      'Deployment complete - Origin: ' + chalk.bold(body.brandedUrl),
    )
  } catch (error) {
    spinner.fail(`Provisioning environment "${env}" failed!`)
    throw error
  }
}

export default provisionEnvironment
