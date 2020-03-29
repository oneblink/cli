'use strict'

const Boom = require('@hapi/boom')

module.exports = function (request) {
  throw Boom.badRequest('Testing boom errors', request.url)
}
