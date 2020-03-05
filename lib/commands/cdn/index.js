// @flow
'use strict'
const cliConfig = require('./lib/cli')
const command /* : CLICommand */ = async (
  tenant,
  inputs,
  blinkMobileIdentity,
) => {
  try {
    const cli = cliConfig()
    const flags = cli.flags
    if (typeof commands[inputs[0]] !== 'function') {
      throw new Error('Could not implement command!')
    }
    return commands[inputs[0]](inputs.slice(1), flags, tenant)
  } catch (err) {
    console.error('Command not found!')
  }
}

const commands = {
  scope: require('./lib/scope'),
  deploy: require('./lib/deploy'),
}

module.exports = command
