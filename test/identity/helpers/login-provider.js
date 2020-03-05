'use strict'

function loginProviderMock(loginFn) {
  return class LoginProvider {
    login(a, b, c) {
      return loginFn(a, b, c)
    }
  }
}

module.exports = loginProviderMock
