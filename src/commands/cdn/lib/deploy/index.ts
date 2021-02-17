import path from 'path'

import ora from 'ora'
import awsS3 from '@blinkmobile/aws-s3'

import confirm from '../utils/confirm'
import bucketParams from '../s3-bucket-params'
import provisionEnvironment from '../provision-environment'
import getAwsCredentials from '../aws-credentials'
import s3Factory from '../s3-bucket-factory'

import read from '../read'

import OneBlinkAPIClient from '../../../../oneblink-api-client'

export default async function (
  input: Array<string>,
  flags: any,
  oneBlinkAPIClient: OneBlinkAPIClient,
): Promise<void> {
  return confirm(flags.force, flags.env).then((confirmation) => {
    if (!confirmation) {
      return
    }
    return read(flags.cwd).then((cfg) => {
      return Promise.all([
        bucketParams.read(flags.cwd, cfg.region),
        getAwsCredentials(cfg, flags.env, oneBlinkAPIClient),
      ])
        .then((results) => s3Factory(...results))
        .then((s3) => {
          const spinner = ora({ spinner: 'dots', text: 'Uploading to CDN' })
          const uploadParams = {
            s3,
            skip: flags.skip,
            prune: flags.prune,
            // Allow deployment of files in a sub directory to the current working directory
            cwd: path.join(flags.cwd, input[0] || '.'),
            bucketPathPrefix: flags.env,
          }

          spinner.start()
          const task = awsS3.upload(uploadParams)
          task.on('skipped', (fileName: string) => {
            spinner.warn(`skipped: ${fileName}`)
          })
          task.on('uploaded', (fileName: string) => {
            spinner.succeed(`uploaded: ${fileName}`)
          })
          task.on('deleted', (fileName: string) => {
            spinner.warn(`deleted: ${fileName}`)
          })
          return task.promise.catch((err: Error) => {
            spinner.fail('Deployment failed!')
            return Promise.reject(err)
          })
        })
        .then(() => provisionEnvironment(cfg, flags.env, oneBlinkAPIClient))
    })
  })
}
