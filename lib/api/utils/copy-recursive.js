/* @flow */
'use strict'

const copy = require('recursive-copy')

const CPR_OPTIONS = {
  overwrite: true,
  dot: true
}

function copyRecursive (
  source /* : string */,
  target /* : string */
) /* : Promise<void> */ {
  return copy(source, target, CPR_OPTIONS)
}

module.exports = copyRecursive
