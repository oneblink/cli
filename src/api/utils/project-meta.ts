import type { BlinkMRC, ProjectConfig } from '../types.js'

import configLoader from '@blinkmobile/blinkmrc'
import pkg from '../../package.js'

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
