import type { BlinkMRCServer } from './types'

import chalk from 'chalk'
import Table from 'cli-table3'
import objectMerge from 'object-merge'

import projectMeta from './utils/project-meta'
import values from './values'

function read(cwd: string): Promise<BlinkMRCServer> {
  return projectMeta
    .read(cwd)
    .then((cfg) => (cfg && cfg.server ? cfg.server : {}))
}

function display(
  logger: typeof console,
  cwd: string,
  env: string | undefined,
): Promise<void> {
  return read(cwd)
    .then((meta) => (meta.project ? meta : Promise.reject(new Error())))
    .catch(() =>
      Promise.reject(
        new Error(
          'Scope has not been set yet, see --help for information on how to set scope.',
        ),
      ),
    )
    .then((meta) => {
      const table = new Table()
      table.push(
        [
          {
            content: chalk.bold('Scope'),
            hAlign: 'center',
            colSpan: 2,
          },
        ],
        [chalk.grey('Project'), meta.project],
        [chalk.grey('Timeout'), meta.timeout || values.DEFAULT_TIMEOUT_SECONDS],
      )
      if (env) {
        table.push([chalk.grey('Environment'), env])
      }
      const memorySize = meta.memorySize
      if (typeof memorySize === 'number') {
        table.push([chalk.grey('Memory Allocation'), `${memorySize} MB`])
      }
      logger.log(table.toString())
    })
}

function write(cwd: string, meta: BlinkMRCServer): Promise<BlinkMRCServer> {
  meta = meta || {}
  if (!meta.project) {
    return Promise.reject(new Error('meta.project was not defined.'))
  }

  return projectMeta
    .write(cwd, (config) => {
      return objectMerge(config, {
        server: {
          project: meta.project,
        },
      })
    })
    .then((cfg) => cfg.server || {})
}

export default {
  read,
  display,
  write,
}
