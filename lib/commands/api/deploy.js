/* @flow */
'use strict'

/* ::
import type {
  APIEnvironment,
  CLIFlags,
  CLIOptions
} from '../../api/types.js'
*/

const util = require('util')

const jwt = require('jsonwebtoken')
const ora = require('ora')
const temp = require('temp').track()
const semver = require('semver')

const pkg = require('../../../package.json')
const info = require('./info.js')
const deploy = require('../../api/deploy.js')
const scope = require('../../api/scope.js')
const upsertAPIEnvironment = require('../../api/upsert-api-environment.js')
const getAPIInstance = require('../../api/get-api-instance.js')
const getAWSAccount = require('../../api/get-aws-account.js')
const serverlessCommand = require('./serverless.js')
const serverless = require('../../api/serverless.js')
const fqdnHelper = require('../../api/utils/fully-qualified-domain-name.js')
const values = require('../../api/values.js')

module.exports = async function(
  tenant /* : Tenant */,
  input /* : Array<string> */,
  flags /* : CLIFlags */,
  logger /* : typeof console */,
  options /* : CLIOptions */,
) /* : Promise<void> */ {
  const blinkMobileIdentity = options.blinkMobileIdentity
  const cwd = flags.cwd
  const env = flags.env
  const force = flags.force
  await info(tenant, input, flags, logger, options)
  const confirmation = await deploy.confirm(logger, force, env)
  if (!confirmation) {
    return
  }
  const config = await scope.read(cwd)
  const [awsCredentials, accessToken] = await deploy.authenticate(
    tenant,
    config,
    blinkMobileIdentity,
    env,
  )

  // If environment does not exist or --provision flag is set, full deploy.
  // A full deploy is also required if the environment is
  // being deployed using a different major version of the
  // Server CLI as this will change the NodeJS version.
  const apiInstance = await getAPIInstance(tenant, config, accessToken)
  const existingEnvironment /* : APIEnvironment | void */ = (
    apiInstance.environments || []
  ).find(apiEnvironment => apiEnvironment.environment === env)
  const environmentExists =
    !!existingEnvironment &&
    existingEnvironment.bmServerVersion &&
    semver.major(existingEnvironment.bmServerVersion) ===
      semver.major(pkg.version)
  if (flags.provision || !environmentExists) {
    const zipFilePath = await deploy.zip(cwd)
    const bundleKey = await deploy.upload(
      tenant,
      zipFilePath,
      awsCredentials,
      config,
    )
    await deploy.deploy(tenant, bundleKey, accessToken, env, config)
    return
  }

  const spinner = ora('Deploying project...').start()
  try {
    // otherwise, just update lambda
    const mkdir = util.promisify(temp.mkdir)
    const tempDirectory = await mkdir('server-cli')
    const awsAccount = await getAWSAccount(
      tenant,
      apiInstance,
      config,
      accessToken,
    )

    // if the analytics key is available, pass it through to be used by the instance
    const analyticsFlags = {}
    if (config.analytics) {
      const analytics = config.analytics
      if (analytics.key && analytics.secret) {
        // generate JWT
        analyticsFlags.analyticsCollectorToken = jwt.sign(
          {
            iss: analytics.key,
          },
          analytics.secret,
          {
            expiresIn: '3650d',
          },
        )
      }
      analyticsFlags.analyticsOrigin =
        analytics.origin || values.ANALYTICS_ORIGIN
    }
    await serverlessCommand(
      tenant,
      [],
      Object.assign({}, flags, analyticsFlags, {
        out: tempDirectory,
        deploymentBucket: tenant.apiHostingBucket,
        executionRole: `arn:aws:iam::${awsAccount.accountNumber}:role/${apiInstance.executionIamRole}`,
        vpcSecurityGroups: apiInstance.vpcSecurityGroupIds || '',
        vpcSubnets: apiInstance.vpcSubnetIds || '',
      }),
      logger,
      options,
    )
    const functionName = serverless.getFunctionName(config, env)
    await serverless.executeSLSCommand(
      ['deploy', 'function', '--function', functionName, '--force'],
      {
        cwd: tempDirectory,
        env: Object.assign({}, process.env, {
          AWS_ACCESS_KEY_ID: awsCredentials.accessKeyId,
          AWS_SECRET_ACCESS_KEY: awsCredentials.secretAccessKey,
          AWS_SESSION_TOKEN: awsCredentials.sessionToken,
        }),
      },
    )
    await upsertAPIEnvironment(
      tenant,
      config,
      apiInstance,
      env,
      cwd,
      accessToken,
    )
    spinner.succeed(
      `Deployment complete - Origin: https://${fqdnHelper.getFQDN(
        apiInstance.id,
        env,
      )}`,
    )
  } catch (error) {
    spinner.fail('Deployment failed...')
    throw error
  }
}
