'use strict'

function userConfigStoreMock(userLoadFn, userUpdateFn, userWriteFn) {
  userLoadFn = userLoadFn || (() => Promise.resolve({}))
  userUpdateFn = userUpdateFn || ((updateFn) => Promise.resolve(updateFn({})))
  userWriteFn = userWriteFn || ((config) => Promise.resolve(config))
  return {
    getStore: () => ({
      load: () => userLoadFn(),
      update: (updateFn) => userUpdateFn(updateFn),
      write: (config) => userWriteFn(config),
    }),
  }
}

module.exports = userConfigStoreMock
