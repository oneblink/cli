import Table from 'cli-table3'
import chalk from 'chalk'

import readCors from './read'
import validateCors from './validate'

function displayCors(logger: typeof console, cwd: string): Promise<void> {
  return readCors(cwd).then((cors) => {
    if (!cors) {
      return
    }
    return validateCors(cors).then((mergedCors) => {
      const table = new Table()
      table.push(
        [
          {
            content: chalk.bold('Cors Configuration'),
            hAlign: 'center',
            colSpan: 2,
          },
        ],
        [chalk.grey('Origins'), (mergedCors.origins || []).sort().join('\n')],
        [
          chalk.grey('Allowed Headers'),
          (mergedCors.headers || []).sort().join('\n'),
        ],
        [
          chalk.grey('Exposed Headers'),
          (mergedCors.exposedHeaders || []).sort().join('\n'),
        ],
        [chalk.grey('Max Age'), mergedCors.maxAge],
        [chalk.grey('Allow Credentials'), mergedCors.credentials],
      )

      logger.log(table.toString())
    })
  })
}

export default displayCors
