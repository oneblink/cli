import type { CLICommand } from '../../commands.js'

import chalk from 'chalk'
import meow from 'meow'
import login from '../common/login.js'

const loginCommand: CLICommand = async (tenant) => {
  const help = `
${chalk.bold(`${tenant.label} Login Command`)}

${chalk.blue('login')} ${chalk.grey('...............')} Start the login process

${chalk.bold('Examples')}

  ${chalk.blue(`${tenant.command} login`)}`

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

  await login(tenant)
  console.log(`
Success! Welcome to ${tenant.label}. Be sure to logout when you're finished.`)
}

export default loginCommand
