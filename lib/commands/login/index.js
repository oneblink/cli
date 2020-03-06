// @flow
'use strict'

/* ::
import type { CLICommand } from '..'
*/

const chalk = require('chalk')
const meow = require('meow')

const loginCommand /* : CLICommand */ = async (
  tenant,
  inputs,
  oneBlinkIdentity,
) => {
  const help = `
${chalk.bold(`${tenant.label} Login Command`)}

${chalk.blue('login')} ${chalk.grey(
    '...............',
  )} Start the login process, if no flags are passed, a browser based login will begin
  ${chalk.blue('--username')} ${chalk.grey(
    '........',
  )} Username to login with, if password is not specified, you will be prompted for it
  ${chalk.blue('--password')} ${chalk.grey(
    '........',
  )} Password to login with, requires the username flag as well

${chalk.bold('Examples')}

  ${chalk.blue(`${tenant.command} login`)}
  ${chalk.blue(`${tenant.command} login --username`)}
  ${chalk.blue(`${tenant.command} login --username email@provider.com`)}`

  const { flags } = meow({
    help,
    flags: {
      help: {
        type: 'boolean',
      },
      username: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    },
  })

  if (flags.help) {
    console.log(help)
    return
  }

  if (flags.username === '') flags.username = true
  await oneBlinkIdentity.login(tenant, {
    username: flags.username,
    password: flags.password,
    storeJwt: true,
  })
  console.log(`
Success! Welcome to ${tenant.label}. Be sure to logout when you're finished.`)
}

module.exports = loginCommand
