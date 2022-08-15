import os from 'os'

import Table from 'cli-table3'
import chalk from 'chalk'

import projectMeta from './utils/project-meta.js'
import { APITypes } from '@oneblink/types'

async function displayNetwork(
  logger: typeof console,
  cwd: string,
  environment: string,
): Promise<void> {
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
  cwd: string,
  environment: string,
): Promise<APITypes.APIDeploymentPayload['network']> {
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

export default {
  readNetwork,
  displayNetwork,
}
