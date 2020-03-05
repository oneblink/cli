/* @flow */
'use strict'

/* ::
import type {
  CLIFlags,
  CLIOptions
} from '../../api/types.js'
*/

const os = require('os')

const displayCors = require('../../api/cors/display.js')
const displayRoutes = require('../../api/routes/display.js')
const scope = require('../../api/scope.js')
const variables = require('../../api/variables.js')
const network = require('../../api/network.js')

module.exports = function(
  tenant /* : Tenant */,
  input /* : Array<string> */,
  flags /* : CLIFlags */,
  logger /* : typeof console */,
  options /* : CLIOptions */,
) /* : Promise<void> */ {
  const tasks = [
    () => scope.display(logger, flags.cwd, flags.env),
    () => displayCors(logger, flags.cwd),
    () => displayRoutes(logger, flags.cwd),
    () => variables.display(logger, flags.cwd, flags.env),
    () => network.displayNetwork(logger, flags.cwd, flags.env),
  ]
  // Catch all errors and let all tasks run before
  // transforming into a single error
  const errors = []
  return tasks
    .reduce((prev, task) => {
      return prev.then(() => task()).catch(error => errors.push(error))
    }, Promise.resolve())
    .then(() => {
      if (errors && errors.length) {
        return Promise.reject(
          new Error(errors.map(error => error.message).join(os.EOL)),
        )
      }
    })
}
