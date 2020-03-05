/* @flow */
'use strict'

/* ::
import type {
  BlinkMRCServer
} from './types.js'
*/

const request = require('request')

function assumeAWSRole(
  tenant /* : Tenant */,
  config /* : BlinkMRCServer */,
  pathname /* : string */,
  accessToken /* : string | void */,
) /* : Promise<Object> */ {
  return new Promise((resolve, reject) => {
    request.post(
      `${tenant.origin}${pathname}`,
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
  }).then(body => ({
    accessKeyId: body.Credentials.AccessKeyId,
    secretAccessKey: body.Credentials.SecretAccessKey,
    sessionToken: body.Credentials.SessionToken,
  }))
}

function assumeAWSRoleToDeploy(
  tenant /* : Tenant */,
  config /* : BlinkMRCServer */,
  env /* : string */,
  accessToken /* : string | void */,
) /* : Promise<Object> */ {
  return assumeAWSRole(
    tenant,
    config,
    `/v2/apis/${config.project || ''}/environments/${env}/credentials/deploy`,
    accessToken,
  )
}

function assumeAWSRoleToViewLogs(
  tenant /* : Tenant */,
  config /* : BlinkMRCServer */,
  env /* : string */,
  accessToken /* : string | void */,
) /* : Promise<Object> */ {
  return assumeAWSRole(
    tenant,
    config,
    `/apis/${config.project || ''}/environments/${env}/credentials/logs`,
    accessToken,
  )
}

function assumeAWSRoleToServeLocally(
  tenant /* : Tenant */,
  config /* : BlinkMRCServer */,
  env /* : string */,
  accessToken /* : string | void */,
) /* : Promise<Object> */ {
  return assumeAWSRole(
    tenant,
    config,
    `/apis/${config.project || ''}/environments/${env}/credentials/serve`,
    accessToken,
  )
}

module.exports = {
  assumeAWSRoleToDeploy,
  assumeAWSRoleToViewLogs,
  assumeAWSRoleToServeLocally,
}
