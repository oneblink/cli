import type OneBlinkAPIClient from '../oneblink-api-client'

import chalk from 'chalk'
import inquirer from 'inquirer'
import ora from 'ora'

function confirm(
  logger: typeof console,
  force: boolean,
  env: string,
): Promise<boolean> {
  if (force) {
    return Promise.resolve(true)
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
  return inquirer
    .prompt(promptQuestions)
    .then((results) => results.confirmation)
}

async function teardown(
  oneBlinkAPIClient: OneBlinkAPIClient,
  apiId: string,
  env: string,
): Promise<void> {
  const spinner = ora(`Tearing down environment "${env}"...`).start()
  try {
    await oneBlinkAPIClient.deleteRequest(`/apis/${apiId}/environments/${env}`)
    spinner.succeed(`Environment "${env}" has been torn down!`)
  } catch (error) {
    spinner.fail(`Tearing down environment "${env}" failed!`)
    throw error
  }
}

export { confirm, teardown }
