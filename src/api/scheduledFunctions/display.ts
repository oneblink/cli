import os from 'os'

import chalk from 'chalk'
import Table from 'cli-table3'

import { readScheduledFunctions } from './readScheduledFunctions.js'
import validateRoute from '../routes/validate.js'

function displayScheduledFunctions(
  logger: typeof console,
  cwd: string,
): Promise<void> {
  return readScheduledFunctions(cwd).then((scheduledFunctionsConfig) => {
    if (!scheduledFunctionsConfig || !scheduledFunctionsConfig.length) {
      return Promise.reject(
        new Error(
          'No scheduled functions found, see documentation on how to create scheduled functions',
        ),
      )
    }

    const table = new Table()
    table.push([
      {
        content: chalk.bold('Scheduled Functions Configuration'),
        hAlign: 'center',
        colSpan: 4,
      },
    ])
    const headings = ['Name', 'Label', 'Module', 'Info']
    table.push(headings.map((heading) => chalk.grey(heading)))

    let totalErrors = 0
    return Promise.all(
      scheduledFunctionsConfig.map((scheduledFunctionsConfig) => {
        return validateRoute(cwd, scheduledFunctionsConfig).then((errors) => {
          const tableRow = [
            scheduledFunctionsConfig.name,
            scheduledFunctionsConfig.label,
            scheduledFunctionsConfig.module,
          ]
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
            `${totalErrors} of ${scheduledFunctionsConfig.length} route configurations are invalid.`,
          ),
        )
      }
    })
  })
}

export default displayScheduledFunctions
