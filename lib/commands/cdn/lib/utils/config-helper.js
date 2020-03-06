/* @flow */
'use strict'

const pkg = require('../../../../../package.json')
const configLoader = require('@blinkmobile/blinkmrc')

function projectConfig(cwd /* : string */) /* : Object */ {
  return configLoader.projectConfig({
    name: pkg.name,
    cwd: cwd,
  })
}

function read(cwd /* : string */) /* : Promise<Object> */ {
  return projectConfig(cwd)
    .load()
    .catch(() =>
      Promise.reject(
        new Error(
          'Scope has not been set yet, see --help for information on how to set scope.',
        ),
      ),
    )
}

function write(
  cwd /* : string */,
  updater /* : (Object) => Object  */,
) /* : Promise<Object> */ {
  return projectConfig(cwd).update(updater)
}

module.exports = { read, write }
