// @flow
'use strict'

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
    case 'logs': {
      return require('./logs')
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
${chalk.blue.bold('API Command')}

${chalk.blue('scope')} ${chalk.grey(
    '...............',
  )} Displays the current scope`

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
        default: pkg.version,
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
