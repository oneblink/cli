/* @flow */
'use strict'

function nonAlphaNumericToDashes (
  str /* : string */
) /* : string */ {
  return str.replace(/[^-0-9a-z]/gi, '-')
}

module.exports = nonAlphaNumericToDashes
