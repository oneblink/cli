import type { CLICommand } from '..'

import meow from 'meow'

import getHelp from './lib/cli/help'

export const meowOptions: Parameters<typeof meow>[0] = {
  flags: {
    debug: {
      type: 'boolean',
      default: false,
    },
    force: {
      type: 'boolean',
      default: false,
    },
    prune: {
      type: 'boolean',
      default: false,
    },
    skip: {
      type: 'boolean',
      default: true,
    },
    bucket: {
      type: 'string',
    },
    cwd: {
      type: 'string',
      default: process.cwd(),
    },
    env: {
      type: 'string',
      default: 'dev',
    },
  },
}

const command: CLICommand = async (tenant, inputs, oneBlinkAPIClient) => {
  try {
    const help = getHelp(tenant)
    const { flags } = meow(help, meowOptions)

    const command = getCLICommand(inputs[0])

    if (flags.help || typeof command !== 'function') {
      console.log(help)
      return
    }

    return command(tenant, inputs.slice(1), flags, oneBlinkAPIClient)
  } catch (err) {
    console.error('Command not found!')
  }
}

function getCLICommand(input: string) {
  switch (input) {
    case 'scope': {
      return require('./lib/scope')
    }
    case 'deploy': {
      return require('./lib/deploy')
    }
  }
}

export default command
