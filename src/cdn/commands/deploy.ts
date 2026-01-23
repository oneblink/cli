import path from 'path'

import ora from 'ora'
import {
  GetObjectCommandInput,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'
import { S3SyncClient } from 's3-sync-client'
import mime from 'mime-types'

import confirm from '../utils/confirm.js'
import provisionEnvironment from '../provision-environment.js'
import getAwsCredentials from '../aws-credentials.js'
import read from '../read.js'
import OneBlinkAPIClient from '../../oneblink-api-client.js'
import { SyncLocalWithBucketOptions } from 's3-sync-client/dist/commands/SyncCommand.js'

export default async function (
  tenant: Tenant,
  input: Array<string>,
  flags: any,
  oneBlinkAPIClient: OneBlinkAPIClient,
): Promise<void> {
  const confirmation = await confirm(flags.force, flags.env)
  if (!confirmation) {
    return
  }

  const cfg = await read(flags.cwd, flags.env)
  const awsCredentials = await getAwsCredentials(
    cfg,
    flags.env,
    oneBlinkAPIClient,
  )

  const spinner = ora({ spinner: 'dots', text: 'Uploading to CDN' })
  spinner.start()

  try {
    const s3Client = new S3Client({
      region: tenant.region,
      credentials: {
        accessKeyId: awsCredentials.AccessKeyId,
        secretAccessKey: awsCredentials.SecretAccessKey,
        sessionToken: awsCredentials.SessionToken,
      },
    })

    const { sync } = new S3SyncClient({ client: s3Client })

    // Allow deployment of files in a sub directory to the current working directory
    const cwd = path.join(flags.cwd, input[0] || '.')
    const options: SyncLocalWithBucketOptions = {
      del: flags.prune,
      commandInput: (input) => {
        const putObjectCommandInput: Partial<PutObjectCommandInput> = {
          ContentType:
            (input.Key && mime.lookup(input.Key)) || 'application/octet-stream',
        }
        // "commandInput" is typed incorrectly to return GetObjectCommandInput
        return putObjectCommandInput as unknown as GetObjectCommandInput
      },
    }

    await sync(cwd, `s3://${cfg.scope}/${flags.env}`, options)
    spinner.succeed('Upload(s) complete!')
  } catch (error) {
    spinner.fail(`Upload(s) failed`)
    throw error
  }

  await provisionEnvironment(cfg, flags.env, oneBlinkAPIClient)
}
