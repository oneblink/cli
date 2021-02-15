'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')

const TEST_SUBJECT = '../../../lib/api/cors/read.js'

const projectMetaMock = require('../helpers/project-meta.js')
const values = require('../../../lib/api/values.js')

const CWD = 'current working directory'
const CORS = true

test.beforeEach((t) => {
  t.context.getTestSubject = (overrides) => {
    overrides = overrides || {}
    return proxyquire(
      TEST_SUBJECT,
      Object.assign(
        {
          '../utils/project-meta.js': projectMetaMock(() =>
            Promise.resolve({
              server: {
                cors: CORS,
              },
            }),
          ),
        },
        overrides,
      ),
    )
  }
})

test('Should call configuration.read() with correct input', (t) => {
  t.plan(1)
  const read = t.context.getTestSubject({
    '../utils/project-meta.js': projectMetaMock((cwd) => {
      t.is(cwd, CWD)
      return Promise.resolve({
        server: {
          cors: CORS,
        },
      })
    }),
  })

  return read(CWD)
})

test('Should return the defaults if cors is true', (t) => {
  const read = t.context.getTestSubject()
  return read().then((cors) =>
    t.deepEqual(cors, {
      credentials: values.DEFAULT_CORS.CREDENTIALS,
      exposedHeaders: values.DEFAULT_CORS.EXPOSED_HEADERS,
      headers: values.DEFAULT_CORS.HEADERS,
      maxAge: values.DEFAULT_CORS.MAX_AGE,
      origins: values.DEFAULT_CORS.ORIGINS,
    }),
  )
})

test('Should return false for uninitialised config file', (t) => {
  const read = t.context.getTestSubject({
    '../utils/project-meta.js': projectMetaMock(() =>
      Promise.resolve({
        test: 123,
      }),
    ),
  })
  return read().then((cors) => t.is(cors, false))
})

test('Should return the currently set cors merged with defaults', (t) => {
  const read = t.context.getTestSubject({
    '../utils/project-meta.js': projectMetaMock(() =>
      Promise.resolve({
        server: {
          cors: {
            headers: undefined,
            origins: ['test'],
          },
        },
      }),
    ),
  })

  return read(CWD).then((cors) =>
    t.deepEqual(cors, {
      credentials: values.DEFAULT_CORS.CREDENTIALS,
      exposedHeaders: values.DEFAULT_CORS.EXPOSED_HEADERS,
      headers: undefined,
      maxAge: values.DEFAULT_CORS.MAX_AGE,
      origins: ['test'],
    }),
  )
})

test('Should reject if configuration.read() throws an error', (t) => {
  const read = t.context.getTestSubject({
    '../utils/project-meta.js': projectMetaMock(() =>
      Promise.reject(new Error('test')),
    ),
  })

  return t.throwsAsync(() => read(CWD), {
    message: 'test',
  })
})
