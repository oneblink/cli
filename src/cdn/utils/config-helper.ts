import * as configLoader from '../../blinkmrc.js'

function projectConfig<T extends object>(cwd: string) {
  return configLoader.projectConfig<T>({
    cwd,
  })
}

async function read<T extends object>(cwd: string): Promise<T> {
  try {
    return await projectConfig<T>(cwd).load()
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
  return await projectConfig<T>(cwd).update(updater)
}

export default { read, write }
