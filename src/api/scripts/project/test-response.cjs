'use strict'

module.exports.get = function (request, response) {
  response.setStatusCode(202)
  response.setHeader('custom', '123')
  return { handler: 123 }
}
