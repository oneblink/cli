import configLoader from '@blinkmobile/blinkmrc'

import pkg from '../../package.js'

function projectConfig(cwd: string): any {
  return configLoader.projectConfig({
    name: pkg.name,
    cwd: cwd,
  })
}

function read(cwd: string): Promise<any> {
  return projectConfig(cwd)
    .load()
    .catch(() =>
      Promise.reject(
        new Error(
          'Scope has not been set yet, see --help for information on how to set scope.',
        ),
      ),
    )
}

function write(cwd: string, updater: (arg0: any) => any): Promise<any> {
  return projectConfig(cwd).update(updater)
}

export default { read, write }
