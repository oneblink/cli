'use strict'

function jsonwebtokenMock(decodeFn) {
  return {
    decode: jwt => {
      return decodeFn(jwt)
    },
  }
}

module.exports = jsonwebtokenMock
