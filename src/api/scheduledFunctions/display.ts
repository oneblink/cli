import os from 'os'

import chalk from 'chalk'
import Table from 'cli-table3'

import readScheduledFunctions from './read.js'
import validateScheduledFunctions from './validate.js'

import { APITypes } from '@oneblink/types'

async function displayScheduledFunctions(
  logger: typeof console,
  cwd: string,
): Promise<void> {
  const scheduledFunctionsConfig = await readScheduledFunctions(cwd)
  if (!scheduledFunctionsConfig || !scheduledFunctionsConfig.length) {
    return
  }
  const headings = [
    'Name',
    'Label',
    'Module',
    'Export',
    'Timeout',
    'Retry On Fail',
    'Info',
  ]
  const table = new Table()
  table.push([
    {
      content: chalk.bold('Scheduled Functions Configuration'),
      hAlign: 'center',
      colSpan: headings.length,
    },
  ])

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
      scheduledFunctionConfig.timeout,
      scheduledFunctionConfig.retryOnFail,
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

export async function displayScheduledFunctionsPostDeploy(
  logger: typeof console,
  scheduledFunctions: APITypes.APIEnvironmentScheduledFunction[],
) {
  const headings = ['Label', 'Has Schedule Been Setup', 'Enabled']
  const table = new Table()
  table.push([
    {
      content: chalk.bold('Scheduled Functions Setup'),
      hAlign: 'center',
      colSpan: headings.length,
    },
  ])

  table.push(headings.map((heading) => chalk.grey(heading)))
  for (const scheduledFunction of scheduledFunctions) {
    const tableRow = [
      scheduledFunction.label,
      scheduledFunction.schedule ? 'Yes' : 'No',
      scheduledFunction.schedule && !scheduledFunction.schedule.isDisabled
        ? 'Yes'
        : 'No',
    ]
    table.push(tableRow)
  }
  logger.log(table.toString())
}

export default displayScheduledFunctions
