'use strict'

function profileMock(getByJWTFn, getByClientFn) {
  getByJWTFn =
    getByJWTFn || (jwt => Promise.resolve({ name: 'FirstName LastName' }))
  getByClientFn =
    getByClientFn || (client => Promise.resolve({ name: 'FirstName LastName' }))
  return {
    getByJWT: getByJWTFn,
    getByClient: getByClientFn,
  }
}

module.exports = profileMock
