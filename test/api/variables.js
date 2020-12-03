'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')

const TEST_SUBJECT = '../../lib/api/variables.js'
const CWD = 'current working directory'
const blinkmrc = {
  server: {
    variables: {
      MY_VARIABLE_SCOPED: {
        test: 'test scoped value',
        prod: 'prod scoped value',
      },
      MY_VARIABLE: 'unscoped value',
      MY_REFERENCED_VARIABLE: '${MY_REFERENCE}',
    },
  },
}

test.beforeEach((t) => {
  t.context.getTestSubject = (overrides) => {
    overrides = overrides || {}
    return proxyquire(
      TEST_SUBJECT,
      Object.assign(
        {
          './utils/project-meta.js': {
            read: () => Promise.resolve(blinkmrc),
          },
        },
        overrides,
      ),
    )
  }

  t.context.logger = {
    log: () => {},
  }
})

test('read() should handle an unitinitalised config file', (t) => {
  const variables = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: () => Promise.resolve(),
    },
  })
  return variables.read().then((envVars) => t.deepEqual(envVars, {}))
})

test('read() should return the correct values for the scoped variables', (t) => {
  const referencedValue = 'referenced value'
  const variables = t.context.getTestSubject()
  process.env.MY_REFERENCE = referencedValue

  return variables
    .read(CWD, 'dev')
    .then((envVars) =>
      t.deepEqual(envVars, {
        MY_VARIABLE: 'unscoped value',
        MY_REFERENCED_VARIABLE: referencedValue,
      }),
    )
    .then(() => variables.read(CWD, 'test'))
    .then((envVars) =>
      t.deepEqual(envVars, {
        MY_VARIABLE_SCOPED: 'test scoped value',
        MY_VARIABLE: 'unscoped value',
        MY_REFERENCED_VARIABLE: referencedValue,
      }),
    )
    .then(() => variables.read(CWD, 'prod'))
    .then((envVars) =>
      t.deepEqual(envVars, {
        MY_VARIABLE_SCOPED: 'prod scoped value',
        MY_VARIABLE: 'unscoped value',
        MY_REFERENCED_VARIABLE: referencedValue,
      }),
    )
})

test('read() should reject if there is a variable with an unsupported type value', (t) => {
  const variables = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: () =>
        Promise.resolve({
          server: {
            variables: {
              UNSUPPORTED_TYPE: 123,
            },
          },
        }),
    },
  })

  return t.throwsAsync(
    () => variables.read(),
    'Variable UNSUPPORTED_TYPE must be an object or a string',
  )
})

test('read() should reject if there is a scoped variable with an unsupported type value', (t) => {
  const variables = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: () =>
        Promise.resolve({
          server: {
            variables: {
              UNSUPPORTED_TYPE: {
                dev: true,
              },
            },
          },
        }),
    },
  })

  return t.throwsAsync(
    () => variables.read(CWD, 'dev'),
    'Variable UNSUPPORTED_TYPE for Environment dev must be a string',
  )
})

test('display() should not log anything if there are no variables to display', (t) => {
  const variables = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: () => Promise.resolve(),
    },
  })

  return t.notThrows(() => variables.display({ log: () => t.fail() }))
})

test('display() should log once', (t) => {
  const variables = t.context.getTestSubject()

  return variables.display({ log: () => t.pass() })
})
