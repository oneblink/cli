/* @flow */
'use strict'

const os = require('os')

const Table = require('cli-table2')
const chalk = require('chalk')

const projectMeta = require('./utils/project-meta.js')

/* ::
import type {
  EnvironmentNetworkConfiguration
} from './types.js'
*/

async function displayNetwork(
  logger /* : typeof console */,
  cwd /* : string */,
  environment /* : string */,
) /* : Promise<void> */ {
  const networkConfiguration = await readNetwork(cwd, environment)
  if (!networkConfiguration) {
    return
  }

  const table = new Table()
  table.push(
    [
      {
        content: chalk.bold(`Network Configuration (${environment})`),
        hAlign: 'center',
        colSpan: 2,
      },
    ],
    [chalk.grey('VPC Subnets'), networkConfiguration.vpcSubnets.join(os.EOL)],
    [
      chalk.grey('VPC Security Groups'),
      networkConfiguration.vpcSecurityGroups.join(os.EOL),
    ],
  )

  logger.log(table.toString())
}

async function readNetwork(
  cwd /* : string */,
  environment /* : string */,
) /* : Promise<EnvironmentNetworkConfiguration | void> */ {
  const config = await projectMeta.read(cwd)
  if (
    !config.server ||
    !config.server.network ||
    !config.server.network[environment] ||
    typeof config.server.network[environment] !== 'object'
  ) {
    return
  }
  return config.server.network[environment]
}

module.exports = {
  readNetwork,
  displayNetwork,
}
