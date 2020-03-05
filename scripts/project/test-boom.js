'use strict'

const Boom = require('boom')

module.exports = function (request, response) {
  throw Boom.badRequest('Testing boom errors', request.url)
}
