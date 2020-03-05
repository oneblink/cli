'use strict'

// https://www.npmjs.com/package/boom
const Boom = require('boom')

module.exports = function (request) {
  throw new Boom(request.url.query.message || null, {
    statusCode: request.url.query.status || 500,
    data: request.url
  })
}
