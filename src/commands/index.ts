import os from 'os'

import chalk from 'chalk'
import execa from 'execa'
import minimist from 'minimist'
import updateNotifier from 'update-notifier'
import packageEnginesNotifier from 'package-engines-notifier'

import OneBlinkAPIClient from '../oneblink-api-client'
import pkg from '../package'

export type CLICommand = (
  tenant: Tenant,
  inputs: string[],
  oneBlinkAPIClient: OneBlinkAPIClient,
) => Promise<void>

async function getCLICommand(input: string): Promise<CLICommand | void> {
  switch (input) {
    case 'login': {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require('./login').default
    }
    case 'api':
    case 'server': {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require('./api').default
    }
    case 'cdn':
    case 'client': {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require('./cdn').default
    }
    case 'logout': {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require('./logout').default
    }
  }
}

export default async function runCommands(tenant: Tenant): Promise<void> {
  updateNotifier({ pkg }).notify()

  if (packageEnginesNotifier.enginesNotify({ pkg })) {
    process.exitCode = 1
    return
  }

  const { _: inputs } = minimist(process.argv.slice(2))

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
    const runCommand = await getCLICommand(command)
    if (!runCommand) {
      console.log(help)
      return
    }

    const oneBlinkAPIClient = new OneBlinkAPIClient(tenant)

    await runCommand(tenant, inputs.slice(1), oneBlinkAPIClient)
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
  Operating System: ${os.platform()}
  CLI Version:      v${pkg.version}
  Node Version:     ${process.version}
  NPM Version:      v${npmVersion}`)}`)
    })
  }
}
