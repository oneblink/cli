// @flow
'use strict'

/* ::
import type { CLICommand } from '..'
*/

const meow = require('meow')

const rawFlags = require('./lib/cli/flags')
const getHelp = require('./lib/cli/help')

const command /* : CLICommand */ = async (
  tenant,
  inputs,
  blinkMobileIdentity,
) => {
  try {
    const help = getHelp(tenant)
    const { flags } = meow({
      help,
      flags: rawFlags,
    })

    if (flags.help || typeof commands[inputs[0]] !== 'function') {
      console.log(help)
      return
    }

    return commands[inputs[0]](
      inputs.slice(1),
      flags,
      tenant,
      blinkMobileIdentity,
    )
  } catch (err) {
    console.error('Command not found!')
  }
}

const commands = {
  scope: require('./lib/scope'),
  deploy: require('./lib/deploy'),
}

module.exports = command
