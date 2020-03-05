'use strict'

function base64urlMock(encodeFn) {
  encodeFn = encodeFn || (bytes => 'base 64 encoded url')
  return {
    encode: encodeFn,
  }
}

module.exports = base64urlMock
