import chalk from 'chalk'
import inquirer from 'inquirer'
import ora from 'ora'

import type OneBlinkAPIClient from '../oneblink-api-client.js'

async function confirm(force: boolean, env: string): Promise<boolean> {
  if (force) {
    return true
  }
  const promptQuestions = [
    {
      type: 'confirm',
      name: 'confirmation',
      message: chalk.yellow(
        `Are you sure you want to teardown environment "${env}": [Y]`,
      ),
    },
  ]
  const results = await inquirer.prompt(promptQuestions)
  return results.confirmation
}

async function teardown(
  oneBlinkAPIClient: OneBlinkAPIClient,
  cdnId: string,
  env: string,
): Promise<void> {
  const spinner = ora(`Tearing down environment "${env}"...`).start()
  try {
    await oneBlinkAPIClient.deleteRequest(
      `/webApps/${cdnId}/environments/${env}`,
    )
    spinner.succeed(`Environment "${env}" has been torn down!`)
  } catch (error) {
    spinner.fail(`Tearing down environment "${env}" failed!`)
    throw error
  }
}

export { confirm, teardown }
