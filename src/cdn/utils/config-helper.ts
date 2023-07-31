import configLoader from '@blinkmobile/blinkmrc'

import pkg from '../../package.js'

function projectConfig(cwd: string) {
  return configLoader.projectConfig({
    name: pkg.name,
    cwd: cwd,
  })
}

async function read<T extends object>(cwd: string): Promise<T> {
  try {
    return await projectConfig(cwd).load<T>()
  } catch (e) {
    throw new Error(
      'Scope has not been set yet, see --help for information on how to set scope.',
    )
  }
}

async function write<T extends object>(
  cwd: string,
  updater: (arg0: T) => T,
): Promise<T> {
  return await projectConfig(cwd).update<T>(updater)
}

export default { read, write }
