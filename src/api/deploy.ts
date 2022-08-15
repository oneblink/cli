import type OneBlinkAPIClient from '../oneblink-api-client.js'

import type { BlinkMRCServer, DeploymentCredentials } from './types.js'
import type { APITypes } from '@oneblink/types'

import fs from 'fs'
import path from 'path'

import archiver from 'archiver'
import AWS from 'aws-sdk'
import chalk from 'chalk'
import { execa } from 'execa'
import inquirer from 'inquirer'
import temp from 'temp'
import ora from 'ora'

import awsRoles from './assume-aws-roles.js'

temp.track()

const EXT = 'zip'

const getProjectPath = (target: string) => path.join(target, 'project')

async function authenticate(
  oneBlinkAPIClient: OneBlinkAPIClient,
  config: BlinkMRCServer,
  env: string,
): Promise<DeploymentCredentials> {
  const spinner = ora('Authenticating...').start()
  try {
    const awsCredentials = await awsRoles.assumeAWSRoleToDeploy(
      oneBlinkAPIClient,
      config,
      env,
    )

    spinner.succeed('Authentication complete!')

    return awsCredentials
  } catch (err) {
    spinner.fail('Authentication failed...')
    throw err
  }
}

function confirm(
  logger: typeof console,
  force: boolean,
  env: string,
): Promise<boolean> {
  if (force) {
    return Promise.resolve(true)
  }
  logger.log(
    chalk.yellow(`
Please check configuration before continuing
`),
  )
  const promptQuestions = [
    {
      type: 'confirm',
      name: 'confirmation',
      message: `Are you sure you want to deploy to environment "${env}": [Y]`,
    },
  ]
  return inquirer
    .prompt(promptQuestions)
    .then((results) => results.confirmation)
}

async function deploy(
  oneblinkAPIClient: OneBlinkAPIClient,
  apiDeploymentPayload: APITypes.APIDeploymentPayload,
  env: string,
): Promise<void> {
  const spinner = ora(`Provisioning environment "${env}"...`).start()
  try {
    const deployData = await oneblinkAPIClient.postRequest<
      APITypes.APIDeploymentPayload,
      { brandedUrl: string }
    >(
      `/apis/${apiDeploymentPayload.scope}/environments/${env}/deployments`,
      apiDeploymentPayload,
    )

    spinner.succeed(
      'Deployment complete - Origin: ' + chalk.bold(deployData.brandedUrl),
    )
  } catch (error) {
    spinner.fail(`Provisioning environment "${env}" failed!`)
    throw error
  }
}

async function pruneDevDependencies(target: string): Promise<void> {
  const spinner = ora('Removing developer dependencies...').start()
  try {
    await execa('npm', ['prune', '--production'], {
      cwd: getProjectPath(target),
    })

    spinner.succeed('Removed developer dependencies!')
  } catch (error) {
    // Ignore errors when attempting to remove dev dependencies
    spinner.fail('Removing developer dependencies failed...')
  }
}

async function upload(
  zipFilePath: fs.PathLike,
  deploymentCredentials: DeploymentCredentials,
): Promise<void> {
  const spinner = ora('Transferring project...').start()
  let progress = 0

  try {
    const src = fs.createReadStream(zipFilePath)
    const s3 = new AWS.S3(deploymentCredentials.credentials)
    const params = {
      Bucket: deploymentCredentials.s3.bucket,
      Key: deploymentCredentials.s3.key,
      Body: src,
    }

    const manager = s3.upload(params)
    manager.on('httpUploadProgress', (uploadProgress) => {
      // Note that total may be undefined until the payload size is known.
      // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html
      if (uploadProgress.total) {
        progress = Math.floor(
          (uploadProgress.loaded / uploadProgress.total) * 100,
        )
        spinner.text = `Transferring project: ${progress}%`
      }
    })

    await new Promise((resolve, reject) => {
      manager.send((err) => {
        if (err) {
          reject(err)
          return
        }
        resolve(undefined)
      })
    })
    spinner.succeed('Transfer complete!')
  } catch (error) {
    spinner.fail(`Transfer failed: ${progress}%`)
    throw error
  }
}

async function zip(target: string): Promise<fs.PathLike> {
  const spinner = ora('Compressing project...').start()
  try {
    const archive = archiver.create(EXT, {})
    const output = temp.createWriteStream({ suffix: `.${EXT}` })
    archive.pipe(output)
    archive.glob('**/*', {
      cwd: target,
      nodir: true,
      dot: true,
      ignore: ['project/.git/**'],
    })
    archive.finalize()
    const zipFilePath = await new Promise<string | Buffer>(
      (resolve, reject) => {
        const fail = (err: Error) => {
          reject(err)
        }

        archive.on('error', (err) => fail(err))
        output.on('error', (err) => fail(err))
        output.on('finish', () => {
          resolve(output.path)
        })
      },
    )

    spinner.succeed('Compression complete!')
    return zipFilePath
  } catch (error) {
    spinner.fail('Compression failed...')
    throw error
  }
}

export default {
  authenticate,
  confirm,
  getProjectPath,
  deploy,
  pruneDevDependencies,
  upload,
  zip,
}
