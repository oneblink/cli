import { APITypes } from '@oneblink/types'
import chalk from 'chalk'
import Table from 'cli-table3'

import projectMeta from './utils/project-meta'

function read(
  cwd: string,
  env: string,
): Promise<APITypes.APIDeploymentPayload['variables']> {
  return projectMeta
    .read(cwd)
    .then((config) =>
      config && config.server && config.server.variables
        ? config.server.variables
        : {},
    )
    .then((variables) => {
      const keys = Object.keys(variables)

      if (!keys.length) {
        return {}
      }

      const scopedVariables = keys.reduce<
        APITypes.APIDeploymentPayload['variables']
      >((memo, key) => {
        const variable = variables[key]
        switch (typeof variable) {
          case 'string':
            memo[key] = variable
            return memo
          case 'object': {
            if (variable[env]) {
              if (typeof variable[env] !== 'string') {
                throw new Error(
                  `Variable ${key} for Environment ${env} must be a string`,
                )
              }
              memo[key] = variable[env]
            } else {
              // @ts-expect-error we are allowing undefined here
              memo[key] = undefined
            }
            return memo
          }
          default:
            throw new Error(`Variable ${key} must be an object or a string`)
        }
      }, {})

      Object.keys(scopedVariables).forEach((key) => {
        const value = scopedVariables[key]
        if (value) {
          const matches = value.match(/^\${(.*)}$/)
          if (Array.isArray(matches)) {
            const referencedKey = matches[1]
            // @ts-expect-error we are allowing undefined here
            scopedVariables[key] = process.env[referencedKey]
          }
        }
      })

      return scopedVariables
    })
}

function display(
  logger: typeof console,
  cwd: string,
  env: string,
): Promise<void> {
  return read(cwd, env).then((envVars) => _display(logger, envVars, env))
}

function setToCurrentProcess(
  logger: typeof console,
  cwd: string,
  env: string,
): Promise<void> {
  return read(cwd, env).then((envVars) => {
    const keys = Object.keys(envVars)
    if (!keys.length) {
      return
    }

    keys.forEach((key) => {
      process.env[key] = envVars[key]
    })

    return _display(logger, envVars, env)
  })
}

function _display(
  logger: typeof console,
  envVars: { [id: string]: string | void },
  env: string,
): void {
  const keys = Object.keys(envVars)
  if (!keys.length) {
    return
  }

  const rows: Array<
    | string[]
    | Array<{
        content: string
        hAlign: 'center' | 'left' | 'right' | undefined
        colSpan: number
      }>
  > = keys.map((key) => [
    chalk.grey(key),
    envVars[key] || chalk.yellow('[UNSET]'),
  ])

  rows.unshift([
    {
      content: chalk.bold(`Environment Variables (${env})`),
      hAlign: 'center',
      colSpan: 2,
    },
  ])

  const table = new Table()
  table.push(...rows)

  logger.log(table.toString())
}

export default {
  read,
  display,
  setToCurrentProcess,
}
