// @flow
'use strict'

/* ::
import type { CLICommand } from '..'
*/

const chalk = require('chalk')
const meow = require('meow')

const pkg = require('../../../package.json')

function getCLICommand(input) {
  switch (input) {
    case 'deploy': {
      return require('./deploy')
    }
    case 'info': {
      return require('./info')
    }
    case 'scope': {
      return require('./scope')
    }
    case 'serve': {
      return require('./serve')
    }
    case 'serverless': {
      return require('./serverless')
    }
  }
}

const serverCommand /* : CLICommand */ = async (
  tenant,
  inputs,
  blinkMobileIdentity,
) => {
  const help = `
${chalk.bold(`${tenant.label} API Command`)}

${chalk.blue('scope <domain>')} ${chalk.grey(
    '......',
  )} Create a new project by passing the API Hosting identifier
  ${chalk.blue('--cwd')} ${chalk.grey(
    '.............',
  )} Optionally set the project path, defaults to the current working directory

${chalk.blue('info')} ${chalk.grey(
    '................',
  )} Display project information
  ${chalk.blue('--env')} ${chalk.grey(
    '.............',
  )} Display information for a specific environment, defaults to 'dev'
  ${chalk.blue('--cwd')} ${chalk.grey(
    '.............',
  )} Optionally set the project path, defaults to the current working directory

${chalk.blue('serve')} ${chalk.grey(
    '...............',
  )} Start a local development server using local API files
  ${chalk.blue('--env')} ${chalk.grey(
    '.............',
  )} Use environment variables from a specific environment, defaults to 'dev'
  ${chalk.blue('--port')} ${chalk.grey(
    '............',
  )} Set the port to use for server, defaults to 3000
  ${chalk.blue('--cwd')} ${chalk.grey(
    '.............',
  )} Optionally set the project path, defaults to the current working directory

${chalk.blue('deploy')} ${chalk.grey('..............')} Deploy the project
  ${chalk.blue('--force')} ${chalk.grey(
    '...........',
  )} Force deployment without confirmation
  ${chalk.blue('--env')} ${chalk.grey(
    '.............',
  )} Deploy a specific environment, defaults to 'dev'
  ${chalk.blue('--provision')} ${chalk.grey(
    '.......',
  )} Force a full deployment, only use this if told to by support
  ${chalk.blue('--cwd')} ${chalk.grey(
    '.............',
  )} Optionally set the project path, defaults to the current working directory

${chalk.bold('Examples')}

  ${chalk.blue(`${tenant.command} api scope project.api.oneblink.io`)}
  ${chalk.blue(`${tenant.command} api info --env dev`)}
  ${chalk.blue(`${tenant.command} api serve --env test --port 4000`)}
  ${chalk.blue(`${tenant.command} api deploy --env prod --force --provision`)}`

  const { flags } = meow({
    help,
    flags: {
      force: {
        type: 'boolean',
        default: false,
      },
      tail: {
        type: 'boolean',
        default: false,
      },
      provision: {
        type: 'boolean',
        default: false,
      },
      bmServerVersion: {
        type: 'string',
        default: `${pkg.name}@${pkg.version}`,
      },
      cwd: {
        type: 'string',
        default: process.cwd(),
      },
      deploymentBucket: {
        type: 'string',
      },
      env: {
        type: 'string',
        default: 'dev',
      },
      executionRole: {
        type: 'string',
      },
      filter: {
        type: 'string',
      },
      out: {
        type: 'string',
      },
      port: {
        type: 'string',
      },
      tenant: {
        type: 'string',
        default: 'oneblink',
      },
      startTime: {
        type: 'string',
      },
      vpcSecurityGroups: {
        type: 'string',
      },
      vpcSubnets: {
        type: 'string',
      },
      analyticsCollectorToken: {
        type: 'string',
      },
      analyticsOrigin: {
        type: 'string',
      },
    },
  })

  const runSubCommand = getCLICommand(inputs[0])

  if (flags.help || !runSubCommand) {
    console.log(help)
    return
  }

  await runSubCommand(tenant, inputs.slice(1), flags, console, {
    blinkMobileIdentity,
  })
}

module.exports = serverCommand
