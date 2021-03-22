'use strict'

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

beforeEach(() => {
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

test('read() should handle an unitinitalised config file', () => {
  const variables = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: () => Promise.resolve(),
    },
  })
  return variables.read().then((envVars) => expect(envVars).toEqual({}));
})

test('read() should return the correct values for the scoped variables', () => {
  const referencedValue = 'referenced value'
  const variables = t.context.getTestSubject()
  process.env.MY_REFERENCE = referencedValue

  return variables
    .read(CWD, 'dev')
    .then((envVars) =>
      expect(envVars).toEqual({
        MY_VARIABLE_SCOPED: undefined,
        MY_VARIABLE: 'unscoped value',
        MY_REFERENCED_VARIABLE: referencedValue,
      }),
    )
    .then(() => variables.read(CWD, 'test'))
    .then((envVars) =>
      expect(envVars).toEqual({
        MY_VARIABLE_SCOPED: 'test scoped value',
        MY_VARIABLE: 'unscoped value',
        MY_REFERENCED_VARIABLE: referencedValue,
      }),
    )
    .then(() => variables.read(CWD, 'prod'))
    .then((envVars) =>
      expect(envVars).toEqual({
        MY_VARIABLE_SCOPED: 'prod scoped value',
        MY_VARIABLE: 'unscoped value',
        MY_REFERENCED_VARIABLE: referencedValue,
      }),
    );
})

test('read() should reject if there is a variable with an unsupported type value', () => {
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

  return t.throwsAsync(() => variables.read(), {
    message: 'Variable UNSUPPORTED_TYPE must be an object or a string',
  })
})

test('read() should reject if there is a scoped variable with an unsupported type value', () => {
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

  return t.throwsAsync(() => variables.read(CWD, 'dev'), {
    message: 'Variable UNSUPPORTED_TYPE for Environment dev must be a string',
  })
})

test('display() should not log anything if there are no variables to display', done => {
  const variables = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: () => Promise.resolve(),
    },
  })

  return expect(() => variables.display({ log: () => done.fail() })).not.toThrow();
})

test('display() should log once', () => {
  const variables = t.context.getTestSubject()

  return variables.display({ log: () =>  });
})
