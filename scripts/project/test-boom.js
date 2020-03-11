'use strict'

const Boom = require('@hapi/boom')

module.exports = function(request, response) {
  throw Boom.badRequest('Testing boom errors', request.url)
}
