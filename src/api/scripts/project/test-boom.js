'use strict'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Boom = require('@hapi/boom')

module.exports = function (request) {
  throw Boom.badRequest('Testing boom errors', request.url)
}
