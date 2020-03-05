'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')

const jsonwebtokenMock = require('../helpers/jsonwebtoken.js')

const TEST_SUBJECT = '../../../lib/identity/utils/verify-jwt.js'

const JWT = 'a valid jwt'
const DECODED = {
  exp: Date.now() / 1000 + 43200, // 12 hours after tests are run
}

test.beforeEach(t => {
  t.context.getTestSubject = overrides => {
    overrides = overrides || {}
    return proxyquire(
      TEST_SUBJECT,
      Object.assign(
        {
          jsonwebtoken: jsonwebtokenMock(jwt => {
            return DECODED
          }),
        },
        overrides,
      ),
    )
  }
})

test('verifyJWT() should return a jwt', t => {
  const verifyJWT = t.context.getTestSubject()

  return verifyJWT(JWT).then(jwt => {
    t.is(jwt, JWT)
  })
})

test('verifyJWT() should reject if a jwt is not passed in', t => {
  t.plan(1)
  const verifyJWT = t.context.getTestSubject()

  return verifyJWT(null).catch(error => {
    t.deepEqual(
      error,
      new Error('Unauthenticated, please login before using this service.'),
    )
  })
})

test('verifyJWT() should call decode()', t => {
  t.plan(1)
  const verifyJWT = t.context.getTestSubject({
    jsonwebtoken: jsonwebtokenMock(jwt => {
      t.pass()
      return DECODED
    }),
  })

  return verifyJWT(JWT)
})

test('verifyJWT() should reject if decode() does not return an object with an exp property', t => {
  t.plan(1)
  const verifyJWT = t.context.getTestSubject({
    jsonwebtoken: jsonwebtokenMock(jwt => {
      return null
    }),
  })

  return verifyJWT(JWT).catch(error => {
    t.deepEqual(error, new Error('Malformed access token. Please login again.'))
  })
})

test('verifyJWT() should reject if jwt is expired', t => {
  t.plan(1)
  const verifyJWT = t.context.getTestSubject({
    jsonwebtoken: jsonwebtokenMock(jwt => {
      return {
        exp: Date.now() / 1000 - 1, // 1 second before test is run (expired)
      }
    }),
  })

  return verifyJWT(JWT).catch(error => {
    t.deepEqual(
      error,
      new Error(
        'Unauthorised, your access token has expired. Please login again.',
      ),
    )
  })
})
