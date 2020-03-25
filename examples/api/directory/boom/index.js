'use strict'

// https://www.npmjs.com/package/boom
const Boom = require('@hapi/boom')

module.exports = function(request) {
  throw new Boom.Boom(request.url.query.message || null, {
    statusCode: request.url.query.status || 500,
    data: request.url,
  })
}
