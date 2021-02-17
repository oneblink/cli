import type { CLICommand } from '..'

import chalk from 'chalk'
import meow from 'meow'

const loginCommand: CLICommand = async (tenant, inputs, oneBlinkAPIClient) => {
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

  let username: string | boolean | undefined = flags.username
  if (username === '') username = true
  await oneBlinkAPIClient.oneBlinkIdentity.login(tenant, {
    username,
    password: flags.password,
    storeJwt: true,
  })
  console.log(`
Success! Welcome to ${tenant.label}. Be sure to logout when you're finished.`)
}

export default loginCommand
