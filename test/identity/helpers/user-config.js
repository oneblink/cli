'use strict'

function userConfigStoreMock(userLoadFn, userUpdateFn, userWriteFn) {
  userLoadFn = userLoadFn || (options => Promise.resolve({}))
  userUpdateFn =
    userUpdateFn || ((updateFn, options) => Promise.resolve(updateFn({})))
  userWriteFn = userWriteFn || ((config, options) => Promise.resolve(config))
  return {
    getStore: () => ({
      load: () => userLoadFn(),
      update: updateFn => userUpdateFn(updateFn),
      write: config => userWriteFn(config),
    }),
  }
}

module.exports = userConfigStoreMock
