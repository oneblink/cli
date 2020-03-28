// @flow
'use strict'

/* ::
import type { CLICommand } from '..'
*/

const chalk = require('chalk')
const meow = require('meow')

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
      cwd: {
        type: 'string',
        default: process.cwd(),
      },
      env: {
        type: 'string',
        default: 'dev',
      },
      port: {
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
