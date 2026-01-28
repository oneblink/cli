import type { BlinkMRC } from '../types.js'

import * as configLoader from '../../blinkmrc.js'

function projectConfig(cwd: string) {
  return configLoader.projectConfig<BlinkMRC>({
    cwd,
    ENOENTResult: {},
  })
}

async function read(cwd: string): Promise<BlinkMRC> {
  return await projectConfig(cwd).load()
}

async function write(
  cwd: string,
  updater: (config: BlinkMRC) => BlinkMRC,
): Promise<BlinkMRC> {
  return await projectConfig(cwd).update(updater)
}

export default {
  projectConfig,
  read,
  write,
}
