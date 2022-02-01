'use strict'

module.exports.get = function (request) {
  return 'a single books for id: ' + request.url.params.id
}

module.exports.put = function (request) {
  return (
    'Update book and return book for id: ' +
    request.url.params.id +
    ' - ' +
    JSON.stringify(request.body)
  )
}

module.exports.delete = function (request) {
  return 'Delete book for id: ' + request.url.params.id
}
