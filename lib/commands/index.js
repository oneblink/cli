// @flow
'use strict'

const chalk = require('chalk')
const execa = require('execa')

const OneBlinkIdentity = require('../identity')
const pkg = require('../../package.json')

/* ::
export type CLICommand = (Tenant, inputs: string[], OneBlinkIdentity) => Promise<void>
*/

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
      return require('./cdn')
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
${chalk.bold(`${tenant.label} CLI`)}

${chalk.blue('login')} ${chalk.grey('...............')} Start the login process
${chalk.blue('api')} ${chalk.grey('.................')} Use the ${
      tenant.label
    } API Hosting service
${chalk.blue('cdn')} ${chalk.grey('.................')} Use the ${
      tenant.label
    } CDN Hosting service
${chalk.blue('logout')} ${chalk.grey('..............')} Start the logout process

Need more help? Use the ${chalk.blue('--help')} flag on any sub-command:

  ${chalk.blue(`${tenant.command} login --help`)}
  ${chalk.blue(`${tenant.command} api --help`)}
  ${chalk.blue(`${tenant.command} cdn --help`)}
  ${chalk.blue(`${tenant.command} logout --help`)}`

    const command = inputs[0]
    const runCommand = getCLICommand(command)
    if (!runCommand) {
      console.log(help)
      return
    }

    const oneBlinkIdentity = new OneBlinkIdentity()

    await runCommand(tenant, inputs.slice(1), oneBlinkIdentity)
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
