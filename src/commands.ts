import os from 'os'

import chalk from 'chalk'
import execa from 'execa'
import minimist from 'minimist'
import updateNotifier from 'update-notifier'
import packageEnginesNotifier from 'package-engines-notifier'

import OneBlinkAPIClient from './oneblink-api-client'
import pkg from './package'

export type CLICommand = (
  tenant: Tenant,
  inputs: string[],
  oneBlinkAPIClient: OneBlinkAPIClient,
) => Promise<void>

async function getEnvironmentInformation() {
  const { stdout: npmVersion } = await execa('npm', ['-v'])
  return `${chalk.grey(`Your Environment Information:
  Operating System: ${os.platform()}
  CLI Version:      v${pkg.version}
  Node Version:     ${process.version}
  NPM Version:      v${npmVersion}`)}`
}

async function getCLICommand(
  input: string,
): Promise<{ default: CLICommand | undefined }> {
  switch (input) {
    case 'login': {
      return await import('./identity/commands/login')
    }
    case 'api':
    case 'server': {
      return await import('./api/commands')
    }
    case 'cdn':
    case 'client': {
      return await import('./cdn/commands')
    }
    case 'logout': {
      return await import('./identity/commands/logout')
    }
    default: {
      return {
        default: undefined,
      }
    }
  }
}

export default async function runCommands(tenant: Tenant): Promise<void> {
  updateNotifier({ pkg }).notify()

  if (packageEnginesNotifier.enginesNotify({ pkg })) {
    process.exitCode = 1
    return
  }

  const { _: inputs, version, help } = minimist(process.argv.slice(2))

  try {
    if (version) {
      const environmentInformation = await getEnvironmentInformation()
      console.log(environmentInformation)
      return
    }

    const helpInformation = `
${chalk.bold(`${tenant.label} CLI`)}

  ${chalk.blue('login')} ${chalk.grey('.............')} Start the login process
  ${chalk.blue('api')} ${chalk.grey('...............')} Use the ${
      tenant.label
    } API Hosting service
  ${chalk.blue('cdn')} ${chalk.grey('...............')} Use the ${
      tenant.label
    } CDN Hosting service
  ${chalk.blue('logout')} ${chalk.grey('............')} Start the logout process

Need more help? Use the ${chalk.blue('--help')} flag on any sub-command:

  ${chalk.blue(`${tenant.command} login --help`)}
  ${chalk.blue(`${tenant.command} api --help`)}
  ${chalk.blue(`${tenant.command} cdn --help`)}
  ${chalk.blue(`${tenant.command} logout --help`)}`

    const command = inputs[0]
    const { default: runCommand } = await getCLICommand(command)
    if (help || !runCommand) {
      console.log(helpInformation)
      return
    }

    const oneBlinkAPIClient = new OneBlinkAPIClient(tenant)

    await runCommand(tenant, inputs.slice(1), oneBlinkAPIClient)
  } catch (err) {
    process.exitCode = 1
    const environmentInformation = await getEnvironmentInformation()
    const command = `${tenant.command} ${inputs.join(' ')}`
    console.error(`
There was a problem executing ${chalk.blue(command)}:

${chalk.red(err)}

Please fix the error and try again.

${environmentInformation}`)
  }
}
