// @flow
'use strict'

const BlinkMobileIdentity = require('@blinkmobile/bm-identity')
const chalk = require('chalk')
const execa = require('execa')

const pkg = require('../../package.json')

function getCLICommand(input /* : string */) /* : CLICommand | void */ {
  switch (input) {
    case 'login': {
      return require('./login')
    }
    case 'api':
    case 'server': {
      return require('./api')
    }
    case 'cdn':
    case 'client': {
      return require('./client')
    }
    case 'logout': {
      return require('./logout')
    }
  }
}

module.exports = async function runCommands(
  tenant /* : Tenant */,
  inputs /* : string[] */,
) /* : Promise<void> */ {
  try {
    const help = `
${chalk.blue.bold(`${tenant.label} CLI`)}

${chalk.blue('login')} ${chalk.grey('..............')} Start the login process
${chalk.blue('api')} ${chalk.grey('................')} Use the ${
      tenant.label
    } API Hosting service
${chalk.blue('cdn')} ${chalk.grey('................')} Use the ${
      tenant.label
    } CDN Hosting service
${chalk.blue('logout')} ${chalk.grey('.............')} Start the logout process

Need more help? Use the ${chalk.blue('--help')} flag on any sub-command:

  ${tenant.command} login --help
  ${tenant.command} api --help
  ${tenant.command} cdn --help
  ${tenant.command} logout --help`

    const command = inputs[0]
    const runCommand = getCLICommand(command)
    if (!runCommand) {
      console.log(help)
      return
    }

    const blinkMobileIdentity = new BlinkMobileIdentity(tenant.id)

    await runCommand(tenant, inputs.slice(1), blinkMobileIdentity)
  } catch (err) {
    process.exitCode = 1
    await execa('npm', ['-v']).then(({ stdout: npmVersion }) => {
      console.error(`
There was a problem executing ${chalk.blue(
        `${tenant.command} ${inputs.join(' ')}`,
      )}:

${chalk.red(err)}

Please fix the error and try again.

${chalk.grey(`Your Environment Information:
  CLI Version:    v${pkg.version}
  Node Version:   ${process.version}
  NPM Version:    v${npmVersion}`)}`)
    })
  }
}
