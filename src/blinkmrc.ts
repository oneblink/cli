import path from 'path'
import os from 'os'

import AppDirectory from 'appdirectory'
import { loadJsonFile } from 'load-json-file'
import { writeJsonFile } from 'write-json-file'

export type Config<T extends object> = {
  load: () => Promise<T>
  update: (setter: (obj: T) => T) => Promise<T>
}

async function load<T>({
  filePath,
  ENOENTResult,
}: {
  filePath: string
  ENOENTResult?: T
}): Promise<T> {
  let data: never
  try {
    data = await loadJsonFile(filePath)
  } catch (err) {
    if (typeof err === 'object' && err && 'code' in err) {
      switch (err.code) {
        case 'JSONError': {
          throw new Error(`${filePath} is not valid JSON`)
        }
        case 'ENOENT': {
          if (ENOENTResult !== undefined) {
            return ENOENTResult
          }
        }
      }
    }
    throw err
  }
  if (!data || typeof data !== 'object') {
    throw new TypeError(`${filePath} does not define a JSON Object`)
  }
  return data
}

function generateConfig<T extends object>(configOptions: {
  dir: string
  filename: string
}): Config<T> {
  const filename = configOptions.filename
  const filePath = path.join(configOptions.dir, filename)

  const config: Config<T> = {
    async load() {
      return load<T>({ filePath })
    },
    async update<T extends object>(updater: (obj: T) => T): Promise<T> {
      const data = await load<T>({
        filePath,
        ENOENTResult: {} as T,
      })
      const updatedData = updater(data as T)
      await writeJsonFile(filePath, updatedData, {
        indent: 2,
        mode: 0o666,
      })
      return updatedData
    },
  }
  return config
}

export function projectConfig<T extends object>({
  cwd,
}: {
  cwd: string
}): Config<T> {
  return generateConfig<T>({
    dir: cwd,
    // dotfile, like .eslintrc.json or .travis.yml
    filename: `.blinkmrc.json`,
  })
}

export function userConfig<T extends object>({
  name,
}: {
  name: string
}): Config<T> {
  const p = os.platform()

  const dirs = new AppDirectory({
    appName: name,
    // use ~/.config in OS X (like Linux), dotfiles are better for CLIs
    platform: p === 'darwin' ? 'linux' : p,
    useRoaming: false,
  })

  const cfg = generateConfig<T>({
    dir: dirs.userConfig(),
    filename: name,
  })

  return cfg
}
