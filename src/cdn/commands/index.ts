import type { CLICommand } from '../../commands.js'

import meow from 'meow'

import getHelp from '../cli/help.js'

export const meowOptions: Parameters<typeof meow>[0] = {
  importMeta: import.meta,
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

    const command = await getCLICommand(inputs[0])

    if (flags.help || typeof command !== 'function') {
      console.log(help)
      return
    }

    return command(tenant, inputs.slice(1), flags, oneBlinkAPIClient)
  } catch {
    console.error('Command not found!')
  }
}

async function getCLICommand(input: string) {
  switch (input) {
    case 'scope': {
      return (await import('./scope.js')).default
    }
    case 'deploy': {
      return (await import('./deploy.js')).default
    }
    case 'teardown': {
      return (await import('./teardown.js')).default
    }
  }
}

export default command
