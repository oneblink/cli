import Table from 'cli-table3'
import chalk from 'chalk'

import projectMeta from './utils/project-meta.js'

async function displayWaf(
  logger: typeof console,
  cwd: string,
  environment: string,
): Promise<void> {
  const wafConfiguration = await readWaf(cwd, environment)

  const table = new Table()
  table.push(
    [
      {
        content: chalk.bold(
          `Web Application Firewall Configuration (${environment})`,
        ),
        hAlign: 'center',
        colSpan: 2,
      },
    ],
    [
      chalk.grey('Enabled'),
      wafConfiguration === undefined ? 'Not specified' : wafConfiguration,
    ],
  )

  logger.log(table.toString())
}

async function readWaf(
  cwd: string,
  environment: string,
): Promise<boolean | undefined> {
  const config = await projectMeta.read(cwd)
  if (
    config.server &&
    config.server.waf &&
    config.server.waf[environment] &&
    typeof config.server.waf[environment] === 'boolean'
  ) {
    return config.server.waf[environment]
  }
}

export default {
  readWaf,
  displayWaf,
}
