'use strict'

function wait(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms))
}

module.exports = function (request) {
  const ms = parseInt(request.url.query.ms, 10) || 2000

  return wait(ms).then(() => `waited ${ms} milliseconds!`)
}
