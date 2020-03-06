'use strict'

function requestMock(postFn, getFn) {
  postFn = postFn || ((url, data, callback) => callback(null, {}, {}))
  getFn = getFn || ((url, callback) => callback(null, {}, {}))
  return {
    post: (url, data, callback) => {
      postFn(url, data, callback)
    },
    get: (url, callback) => {
      getFn(url, callback)
    },
  }
}

module.exports = requestMock
