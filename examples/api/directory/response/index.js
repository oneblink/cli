'use strict'

module.exports.get = function (request) {
  // Can return a payload, status code will default 200 OK
  return {
    key: 'value',
  }
}

module.exports.delete = function (request) {
  // Can return a status code, 204 NO CONTENT
  return 204
}

module.exports.post = function (request, response) {
  // For more complex use cases, the response object will allow for the following:

  // Set the response status code
  response.setStatusCode(204)
  // response.statusCode === 204

  // Set a response header
  response.setHeader('my-custom-header', 'header value')
  // response.headers === {
  //  'my-custom-header': 'header value'
  // }

  // Set the response payload
  response.setPayload(request.body || 'body of the response')
  // response.payload === (request.body || 'body of the response')

  // Each 'set' function returns the response to allow for chaining
  response
    .setStatusCode(202)
    .setHeader('my-second-header', 'header value')
    .setPayload({
      headers: response.headers,
      payload: response.payload,
      statusCode: response.statusCode,
    })

  // NOTE: No return statement is required.
  // If a return statement is used with a truthy value, the value will
  // override the status code (if a number is returned) or the payload.
  // The above does not apply if the response object is returned.
}
