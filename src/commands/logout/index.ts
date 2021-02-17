import type { CLICommand } from '..'

import chalk from 'chalk'
import meow from 'meow'

const logoutCommand: CLICommand = async (tenant, inputs, oneBlinkAPIClient) => {
  const help = `
${chalk.bold(`${tenant.label} Logout Command`)}

${chalk.blue('logout')} ${chalk.grey('..............')} Start the logout process

${chalk.bold('Examples')}

  ${chalk.blue(`${tenant.command} logout`)}`

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

  await oneBlinkAPIClient.oneBlinkIdentity.logout(tenant)
  console.log(`
Success! See you next time.`)
}

export default logoutCommand
