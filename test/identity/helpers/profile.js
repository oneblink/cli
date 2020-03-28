'use strict'

function profileMock(getByJWTFn, getByClientFn) {
  getByJWTFn =
    getByJWTFn || (() => Promise.resolve({ name: 'FirstName LastName' }))
  getByClientFn =
    getByClientFn || (() => Promise.resolve({ name: 'FirstName LastName' }))
  return {
    getByJWT: getByJWTFn,
    getByClient: getByClientFn,
  }
}

module.exports = profileMock
