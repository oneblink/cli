import os from 'os'

import chalk from 'chalk'
import Table from 'cli-table3'

import readScheduledFunctions from './read.js'
import validateScheduledFunctions from './validate.js'

async function displayScheduledFunctions(
  logger: typeof console,
  cwd: string,
): Promise<void> {
  const scheduledFunctionsConfig = await readScheduledFunctions(cwd)
  if (!scheduledFunctionsConfig || !scheduledFunctionsConfig.length) {
    return
  }
  const table = new Table()
  table.push([
    {
      content: chalk.bold('Scheduled Functions Configuration'),
      hAlign: 'center',
      colSpan: 4,
    },
  ])
  const headings = ['Name', 'Label', 'Module', 'Export', 'Info']
  table.push(headings.map((heading) => chalk.grey(heading)))
  let totalErrors = 0
  for (const scheduledFunctionConfig of scheduledFunctionsConfig) {
    const errors = await validateScheduledFunctions(
      cwd,
      scheduledFunctionConfig,
    )
    const tableRow = [
      scheduledFunctionConfig.name,
      scheduledFunctionConfig.label,
      scheduledFunctionConfig.module,
      scheduledFunctionConfig.export,
    ]
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
      `${totalErrors} of ${scheduledFunctionsConfig.length} scheduled functions configurations are invalid.`,
    )
  }
}

export default displayScheduledFunctions
