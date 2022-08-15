import type { CLICommand } from '../../commands.js'

import chalk from 'chalk'
import meow from 'meow'
import logout from '../common/logout.js'

const logoutCommand: CLICommand = async (tenant) => {
  const help = `
${chalk.bold(`${tenant.label} Logout Command`)}

${chalk.blue('logout')} ${chalk.grey('..............')} Start the logout process

${chalk.bold('Examples')}

  ${chalk.blue(`${tenant.command} logout`)}`

  const { flags } = meow({
    importMeta: import.meta,
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

  await logout(tenant)
  console.log(`
Success! See you next time.`)
}

export default logoutCommand
