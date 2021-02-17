import type { BlinkMRC, ProjectConfig } from '../types'

import configLoader from '@blinkmobile/blinkmrc'
import pkg from '../../package'

function projectConfig(cwd: string): ProjectConfig {
  return configLoader.projectConfig({
    name: pkg.name,
    cwd: cwd,
  })
}

function read(cwd: string): Promise<BlinkMRC> {
  return projectConfig(cwd)
    .load()
    .catch(() => ({}))
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
