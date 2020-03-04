// @flow
'use strict'

const path = require('path')

const BlinkMobileIdentity = require('@blinkmobile/bm-identity')
const chalk = require('chalk')
const execa = require('execa')

const pkg = require('../../package.json')

module.exports = async function runCommands(
  tenant /* : Tenant */,
  inputs /* : string[] */,
) /* : Promise<void> */ {
  const help = `
${chalk.blue.bold(`${tenant.label} CLI`)}

${chalk.blue('login')} ${chalk.grey('..............')} Start the login process
${chalk.blue('server')} ${chalk.grey('.............')} Use the ${
    tenant.label
  } API Hosting service
${chalk.blue('client')} ${chalk.grey('.............')} Use the ${
    tenant.label
  } CDN Hosting service
${chalk.blue('logout')} ${chalk.grey('.............')} Start the logout process

Need more help? Use the ${chalk.blue('--help')} flag on any sub-command:

  ${tenant.id.toLowerCase()} login --help`

  const command = inputs[0]
  if (!command) {
    console.log(help)
    return
  }

  try {
    let runCommand
    try {
      // $FlowFixMe
      runCommand = require(path.join(__dirname, command))
    } catch (error) {
      throw new Error(`Unknown command: ${command}`)
    }

    const blinkMobileIdentity = new BlinkMobileIdentity(tenant.id)

    await runCommand(tenant, inputs.slice(1), blinkMobileIdentity)
  } catch (err) {
    process.exitCode = 1
    await execa('npm', ['-v']).then(({ stdout: npmVersion }) => {
      console.error(`
There was a problem executing "${inputs.join(' ')}":

${chalk.red(err)}

Please fix the error and try again.

${chalk.grey(`Your Environment Information:
  CLI Version:    v${pkg.version}
  Node Version:   ${process.version}
  NPM Version:    v${npmVersion}`)}`)
    })
  }
}
