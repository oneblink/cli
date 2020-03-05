'use strict'

module.exports.get = function (request) {
  return `chapter ${request.url.params.chapterNo} for book id: ${request.url.params.id}`
}
