/* @flow */
'use strict'

/* ::
import type {
  BlinkMRCServer
} from './types.js'
*/

const ora = require('ora')

const awsRoles = require('./assume-aws-roles.js')

function authenticate(
  tenant /* : Tenant */,
  config /* : BlinkMRCServer */,
  blinkMobileIdentity /* : Object */,
  env /* : string */,
) /* : Promise<Object> */ {
  const spinner = ora('Authenticating...').start()
  return blinkMobileIdentity
    .getAccessToken()
    .then(accessToken =>
      awsRoles.assumeAWSRoleToViewLogs(tenant, config, env, accessToken),
    )
    .then(results => {
      spinner.succeed('Authentication complete!')
      return results
    })
    .catch(err => {
      spinner.fail('Authentication failed...')
      return Promise.reject(err)
    })
}

module.exports = {
  authenticate,
}
