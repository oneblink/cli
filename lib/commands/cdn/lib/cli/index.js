'use strict'
// @flow

const meow = require('meow')
const flags = require('./flags')
const help = require('./help')
module.exports = () => {
  return meow({
    help,
    flags,
  })
}
