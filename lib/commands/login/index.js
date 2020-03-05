// @flow
'use strict'

const chalk = require('chalk')
const meow = require('meow')

const loginCommand /* : CLICommand */ = async (
  tenant,
  inputs,
  blinkMobileIdentity,
) => {
  const help = `
${chalk.blue.bold('Login Command')}

${chalk.blue('login')} ${chalk.grey(
    '...............',
  )} Start the login process, if no flags are passed, a browser based login will begin
  ${chalk.blue('--username')} ${chalk.grey(
    '........',
  )} Username to login with, if password is not specified, you will be prompted for it
  ${chalk.blue('--password')} ${chalk.grey(
    '........',
  )} Password to login with, requires the username flag as well

${chalk.blue.bold('Examples')}

  ${tenant.command} login
  ${tenant.command} login --username
  ${tenant.command} login --username email@provider.com`

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
  await blinkMobileIdentity.login({
    username: flags.username,
    password: flags.password,
    storeJwt: true,
  })
  console.log(`
Success! Welcome to ${tenant.label}. Be sure to logout when you're finished.
`)
}

module.exports = loginCommand
