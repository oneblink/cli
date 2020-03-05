/* @flow */
'use strict'

const ora = require('ora')
const request = require('request')

function awsCredentials(
  cfg /* : Object */,
  env /* : string */,
  accessToken /* : string | void */,
) /* : Promise<Object> */ {
  const spinner = ora({ spinner: 'dots', text: 'Authenticating...' }).start()
  return new Promise((resolve, reject) => {
    request(
      `${cfg.service.origin}/v1/service-instances/${cfg.scope}/environments/${env}/aws-role`,
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
    .then(body => {
      spinner.succeed('Authentication complete!')
      return {
        accessKeyId: body.Credentials.AccessKeyId,
        secretAccessKey: body.Credentials.SecretAccessKey,
        sessionToken: body.Credentials.SessionToken,
      }
    })
    .catch(err => {
      spinner.fail('Authentication failed!')
      return Promise.reject(err)
    })
}

module.exports = awsCredentials
