/* @flow */
'use strict'

/* ::
import type {
  BlinkMRCServer
} from './types.js'
*/

const chalk = require('chalk')
const inquirer = require('inquirer')
const request = require('request')
const ora = require('ora')

function confirm(
  logger /* : typeof console */,
  force /* : boolean */,
  env /* : string */,
) /* : Promise<boolean> */ {
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
  tenant /* : Tenant */,
  accessToken /* : string | void */,
  apiId /* : string */,
  env /* : string */,
) /* : Promise<void> */ {
  const spinner = ora(`Tearing down environment "${env}"...`).start()
  try {
    await new Promise((resolve, reject) => {
      request.delete(
        `${tenant.origin}/apis/${apiId}/environments/${env}`,
        {
          auth: {
            bearer: accessToken,
          },
          json: true,
        },
        (err, deployResponse, deployData) => {
          if (err) {
            reject(err)
            return
          }
          if (deployResponse.statusCode !== 204) {
            reject(new Error(deployData.message))
            return
          }

          spinner.succeed(`Environment "${env}" has been torn down!`)
          resolve()
        },
      )
    })
  } catch (error) {
    spinner.fail(`Tearing down environment "${env}" failed!`)
    throw error
  }
}

module.exports = {
  confirm,
  teardown,
}
