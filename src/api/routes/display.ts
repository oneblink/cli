import os from 'os'

import Table from 'cli-table3'
import chalk from 'chalk'

import readRoutes from './read.js'
import validateRoute from './validate.js'
import readScheduledFunctions from '../scheduledFunctions/read.js'

async function displayRoutes(
  logger: typeof console,
  cwd: string,
): Promise<void> {
  const routeConfigs = await readRoutes(cwd)
  if (!routeConfigs.length) {
    const scheduledFunctionsConfig = await readScheduledFunctions(cwd)
    if (!scheduledFunctionsConfig.length) {
      throw new Error(
        'You cannot deploy without defining at least one route or scheduled function.',
      )
    }
    return
  }
  const headings = ['Route', 'Module', 'Info']
  const table = new Table()
  table.push([
    {
      content: chalk.bold('Route Configuration'),
      hAlign: 'center',
      colSpan: headings.length,
    },
  ])
  table.push(headings.map((heading) => chalk.grey(heading)))
  let totalErrors = 0
  for (const routeConfig of routeConfigs) {
    const errors = await validateRoute(cwd, routeConfig)
    const tableRow = [routeConfig.route, routeConfig.module]
    if (errors && errors.length) {
      totalErrors++
      tableRow.push(chalk.red(errors.join(os.EOL)))
    } else {
      tableRow.push(chalk.green('OK'))
    }
    table.push(tableRow)
  }

  logger.log(table.toString())
  if (totalErrors) {
    throw new Error(
      `${totalErrors} of ${routeConfigs.length} route configurations are invalid.`,
    )
  }
}

export default displayRoutes
