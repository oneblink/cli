/* @flow */
'use strict'

const chalk = require('chalk')
const ora = require('ora')
const request = require('request')

function provisionEnvironment(
  cfg /* : Object */,
  env /* : string */,
  accessToken /* : string | void */,
  tenant /* : Tenant */,
) /* : Promise<void> */ {
  const spinner = ora({
    spinner: 'dots',
    text: `Provisioning environment "${env}"...`,
  }).start()
  return new Promise((resolve, reject) => {
    request.post(
      `${tenant.origin}/v1/service-instances/${cfg.scope}/environments/${env}`,
      {
        auth: {
          bearer: accessToken,
        },
        json: true,
      },
      (err, response, body) => {
        if (err) {
          return reject(err)
        }
        if (response.statusCode !== 200) {
          return reject(
            new Error(
              body && body.message
                ? body.message
                : 'Unknown error, please try again and contact support if the problem persists',
            ),
          )
        }
        return resolve(body)
      },
    )
  })
    .then(body =>
      spinner.succeed(
        'Deployment complete - Origin: ' + chalk.bold(body.brandedUrl),
      ),
    )
    .catch(err => {
      spinner.fail(`Provisioning environment "${env}" failed!`)
      return Promise.reject(err)
    })
}

module.exports = provisionEnvironment
