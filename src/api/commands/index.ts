import type { CLICommand } from '../../commands.js'

import chalk from 'chalk'
import meow from 'meow'

async function getCLICommand(input: string) {
  switch (input) {
    case 'deploy': {
      return (await import('./deploy.js')).default
    }
    case 'info': {
      return (await import('./info.js')).default
    }
    case 'scope': {
      return (await import('./scope.js')).default
    }
    case 'serve': {
      return (await import('./serve.js')).default
    }
    case 'teardown': {
      return (await import('./teardown.js')).default
    }
  }
}

const serverCommand: CLICommand = async (tenant, inputs, oneblinkAPIClient) => {
  const help = `
${chalk.bold(`${tenant.label} API Command`)}

${chalk.blue('scope <domain>')} ${chalk.grey(
    '......',
  )} Create a new project by passing the API Hosting identifier
  ${chalk.blue('--cwd')} ${chalk.grey(
    '.............',
  )} Optionally set the project path, defaults to the current working directory

${chalk.blue('info')} ${chalk.grey(
    '................',
  )} Display project information
  ${chalk.blue('--env')} ${chalk.grey(
    '.............',
  )} Display information for a specific environment, defaults to 'dev'
  ${chalk.blue('--cwd')} ${chalk.grey(
    '.............',
  )} Optionally set the project path, defaults to the current working directory

${chalk.blue('serve')} ${chalk.grey(
    '...............',
  )} Start a local development server using local API files
  ${chalk.blue('--env')} ${chalk.grey(
    '.............',
  )} Use environment variables from a specific environment, defaults to 'dev'
  ${chalk.blue('--port')} ${chalk.grey(
    '............',
  )} Set the port to use for server, defaults to 3000
  ${chalk.blue('--cwd')} ${chalk.grey(
    '.............',
  )} Optionally set the project path, defaults to the current working directory

${chalk.blue('deploy')} ${chalk.grey(
    '..............',
  )} Deploy an environment for the project
  ${chalk.blue('--force')} ${chalk.grey(
    '...........',
  )} Force deployment without confirmation
  ${chalk.blue('--env')} ${chalk.grey(
    '.............',
  )} Deploy a specific environment, defaults to 'dev'
  ${chalk.blue('--cwd')} ${chalk.grey(
    '.............',
  )} Optionally set the project path, defaults to the current working directory

${chalk.blue('teardown')} ${chalk.grey(
    '............',
  )} Teardown an enviroment for the project
  ${chalk.blue('--force')} ${chalk.grey(
    '...........',
  )} Force teardown without confirmation
  ${chalk.blue('--env')} ${chalk.grey(
    '.............',
  )} Teardown a specific environment, defaults to 'dev'
  ${chalk.blue('--cwd')} ${chalk.grey(
    '.............',
  )} Optionally set the project path, defaults to the current working directory

${chalk.bold('Examples')}

  ${chalk.blue(`${tenant.command} api scope project.api.oneblink.io`)}
  ${chalk.blue(`${tenant.command} api info --env dev`)}
  ${chalk.blue(`${tenant.command} api serve --env test --port 4000`)}
  ${chalk.blue(`${tenant.command} api deploy --env prod --force`)}
  ${chalk.blue(`${tenant.command} api teardown --env prod --force`)}`

  const { flags } = meow({
    importMeta: import.meta,
    help,
    flags: {
      force: {
        type: 'boolean',
        default: false,
      },
      cwd: {
        type: 'string',
        default: process.cwd(),
      },
      env: {
        type: 'string',
        default: 'dev',
      },
      port: {
        type: 'string',
      },
    },
  })

  const runSubCommand = await getCLICommand(inputs[0])

  if (flags.help || !runSubCommand) {
    console.log(help)
    return
  }

  await runSubCommand(tenant, inputs.slice(1), flags, console, {
    oneblinkAPIClient,
  })
}

export default serverCommand
