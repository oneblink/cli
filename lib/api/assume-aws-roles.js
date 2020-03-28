/* @flow */
'use strict'

/* ::
import type {
  BlinkMRCServer,
  DeploymentCredentials,
  ServeCredentials
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
  })
}

async function assumeAWSRoleToDeploy(
  tenant /* : Tenant */,
  config /* : BlinkMRCServer */,
  env /* : string */,
  accessToken /* : string | void */,
) /* : Promise<DeploymentCredentials> */ {
  const { credentials, s3 } = await assumeAWSRole(
    tenant,
    config,
    `/v3/apis/${config.project || ''}/environments/${env}/credentials/deploy`,
    accessToken,
  )

  return {
    s3,
    credentials: {
      accessKeyId: credentials.AccessKeyId,
      secretAccessKey: credentials.SecretAccessKey,
      sessionToken: credentials.SessionToken,
    },
  }
}

async function assumeAWSRoleToServeLocally(
  tenant /* : Tenant */,
  config /* : BlinkMRCServer */,
  env /* : string */,
  accessToken /* : string | void */,
) /* : Promise<ServeCredentials> */ {
  const { Credentials } = await assumeAWSRole(
    tenant,
    config,
    `/apis/${config.project || ''}/environments/${env}/credentials/serve`,
    accessToken,
  )
  return {
    accessKeyId: Credentials.AccessKeyId,
    secretAccessKey: Credentials.SecretAccessKey,
    sessionToken: Credentials.SessionToken,
  }
}

module.exports = {
  assumeAWSRoleToDeploy,
  assumeAWSRoleToServeLocally,
}
