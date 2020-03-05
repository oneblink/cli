'use strict'

const test = require('ava')

const validate = require('../../../lib/api/cors/validate.js')

const HELP = ', see documentation for information on how to configure cors.'

test('Should reject if cors is not truthy', t => {
  return t.throwsAsync(validate(), 'Must specify cors configuration' + HELP)
})

test('Should reject if origins is undefined or is not an array', t => {
  t.plan(5)
  const configs = [
    {},
    { origins: 'test' },
    { origins: 123 },
    { origins: true },
    { origins: {} },
  ]
  return configs.reduce((prev, config) => {
    return prev.then(() =>
      t.throwsAsync(
        () => validate(config),
        'Must specify at least a single allowable origin in cors configuration' +
          HELP,
      ),
    )
  }, Promise.resolve())
})

test('Should reject if origins is an empty array', t => {
  return t.throwsAsync(
    () =>
      validate({
        origins: [],
      }),
    'Must specify at least a single allowable origin in cors configuration' +
      HELP,
  )
})

test('Should reject if origins contains invalid urls', t => {
  return t.throwsAsync(
    () =>
      validate({
        origins: ['test', '123'],
      }),
    'The following origins in cors configuration are not valid: test, 123',
  )
})

test('Should reject if headers is defined but not as an array', t => {
  t.plan(4)
  const configs = [
    { origins: ['http://test'], headers: 'test' },
    { origins: ['http://test'], headers: 123 },
    { origins: ['http://test'], headers: true },
    { origins: ['http://test'], headers: {} },
  ]
  return configs.reduce((prev, config) => {
    return prev.then(() =>
      t.throwsAsync(
        () => validate(config),
        'Headers must be an array of strings in cors configuration' + HELP,
      ),
    )
  }, Promise.resolve())
})

test('Should reject if exposed headers is defined but not as an array', t => {
  t.plan(4)
  const configs = [
    { origins: ['http://test'], exposedHeaders: 'test' },
    { origins: ['http://test'], exposedHeaders: 123 },
    { origins: ['http://test'], exposedHeaders: true },
    { origins: ['http://test'], exposedHeaders: {} },
  ]
  return configs.reduce((prev, config) => {
    return prev.then(() =>
      t.throwsAsync(
        () => validate(config),
        'Exposed headers must be an array of strings in cors configuration' +
          HELP,
      ),
    )
  }, Promise.resolve())
})

test('Should reject if max age is not a number', t => {
  t.plan(4)
  const configs = [
    { origins: ['http://test'], maxAge: 'test' },
    { origins: ['http://test'], maxAge: true },
    { origins: ['http://test'], maxAge: [] },
    { origins: ['http://test'], maxAge: {} },
  ]
  return configs.reduce((prev, config) => {
    return prev.then(() =>
      t.throwsAsync(
        () => validate(config),
        'Max age must be a number in cors configuration' + HELP,
      ),
    )
  }, Promise.resolve())
})

test('Should reject if credentials is not a boolean', t => {
  t.plan(4)
  const configs = [
    { origins: ['http://test'], maxAge: 1, credentials: 'test' },
    { origins: ['http://test'], maxAge: 1, credentials: 123 },
    { origins: ['http://test'], maxAge: 1, credentials: [] },
    { origins: ['http://test'], maxAge: 1, credentials: {} },
  ]
  return configs.reduce((prev, config) => {
    return prev.then(() =>
      t.throwsAsync(
        () => validate(config),
        'Credentials must be a boolean in cors configuration' + HELP,
      ),
    )
  }, Promise.resolve())
})

test('Should resolve input if all cors is valid', t => {
  const cors = {
    origins: ['http://test'],
    headers: ['test'],
    exposedHeaders: ['test'],
    maxAge: 1,
    credentials: true,
  }
  return validate(cors).then(validated => t.deepEqual(validated, cors))
})
