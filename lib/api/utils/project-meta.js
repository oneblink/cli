/* @flow */
'use strict'

/* ::
import type {BlinkMRC, ProjectConfig} from '../types.js'
*/

const configLoader = require('@blinkmobile/blinkmrc')

const pkg = require('../../../package.json')

function projectConfig(cwd /* : string */) /* : ProjectConfig */ {
  return configLoader.projectConfig({
    name: pkg.name,
    cwd: cwd,
  })
}

function read(cwd /* : string */) /* : Promise<BlinkMRC> */ {
  return projectConfig(cwd)
    .load()
    .catch(() => ({}))
}

function write(
  cwd /* : string */,
  updater /* : (BlinkMRC) => BlinkMRC */,
) /* : Promise<BlinkMRC> */ {
  return projectConfig(cwd).update(updater)
}

module.exports = {
  projectConfig,
  read,
  write,
}
