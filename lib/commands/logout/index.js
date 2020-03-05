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
${chalk.blue.bold('Logout Command')}

${chalk.blue('logout')} ${chalk.grey(
    '...............',
  )} Start the logout process

${chalk.blue.bold('Examples')}

  ${tenant.command} logout`

  const { flags } = meow({
    help,
    flags: {
      help: {
        type: 'boolean',
      },
    },
  })

  if (flags.help) {
    console.log(help)
    return
  }

  await blinkMobileIdentity.logout()
  console.log(`
Success! See you next time.
`)
}

module.exports = loginCommand
