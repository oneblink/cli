/* @flow */
'use strict'

const fs = require('fs')

const pify = require('pify')
const yaml = require('js-yaml')

function readYamlFile (
  filePath /* : string */
) /* : Promise<Object> */ {
  return pify(fs.readFile)(filePath, 'utf8')
    .then((content) => yaml.safeLoad(content))
}

function updateYamlFile (
  filePath /* : string */,
  updater /* : (data: Object) => Object */
) /* : Promise<void> */ {
  return readYamlFile(filePath)
    .then((data) => updater(data))
    .then((data) => pify(fs.writeFile)(
      filePath,
      yaml.safeDump(data),
      'utf8')
    )
}

module.exports = {
  readYamlFile,
  updateYamlFile
}
