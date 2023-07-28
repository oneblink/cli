import { teardown, confirm } from '../teardown.js'
import read from '../read.js'
import OneBlinkAPIClient from '../../oneblink-api-client.js'

export default async function (
  input: Array<string>,
  flags: any,
  oneBlinkAPIClient: OneBlinkAPIClient,
): Promise<void> {
  const env = flags.env
  const cwd = flags.cwd
  const force = flags.force

  const config = await read(cwd)
  const cdnId = config.project
  if (!cdnId) {
    throw new Error('scope has not been set yet')
  }

  const confirmation = await confirm(force, env)
  if (!confirmation) {
    return
  }

  await teardown(oneBlinkAPIClient, cdnId, env)
}
