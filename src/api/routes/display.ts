import os from 'os'

import Table from 'cli-table3'
import chalk from 'chalk'

import readRoutes from './read'
import validateRoute from './validate'

function displayRoutes(logger: typeof console, cwd: string): Promise<void> {
  return readRoutes(cwd).then((routeConfigs) => {
    if (!routeConfigs || !routeConfigs.length) {
      return Promise.reject(
        new Error(
          'No routes found, see documentation for information on how to create routes.',
        ),
      )
    }

    const table = new Table()
    table.push([
      {
        content: chalk.bold('Route Configuration'),
        hAlign: 'center',
        colSpan: 3,
      },
    ])
    const headings = ['Route', 'Module', 'Info']
    table.push(headings.map((heading) => chalk.grey(heading)))

    let totalErrors = 0
    return Promise.all(
      routeConfigs.map((routeConfig) => {
        return validateRoute(cwd, routeConfig).then((errors) => {
          const tableRow = [routeConfig.route, routeConfig.module]
          if (errors && errors.length) {
            totalErrors++
            tableRow.push(chalk.red(errors.join(os.EOL)))
          } else {
            tableRow.push(chalk.green('OK'))
          }
          table.push(tableRow)
        })
      }),
    ).then(() => {
      logger.log(table.toString())
      if (totalErrors) {
        return Promise.reject(
          new Error(
            `${totalErrors} of ${routeConfigs.length} route configurations are invalid.`,
          ),
        )
      }
    })
  })
}

export default displayRoutes
