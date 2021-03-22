'use strict'

const TEST_SUBJECT = '../../../lib/api/routes/validate.js'

const CWD = 'current working directory'
const PATH_RESOLVE = 'returned from path resolve'
const MODULE = 'module path'

beforeEach(() => {
  t.context.getTestSubject = (overrides) => {
    overrides = overrides || {}
    return proxyquire(
      TEST_SUBJECT,
      Object.assign(
        {
          path: {
            resolve: () => PATH_RESOLVE,
          },

          fs: {
            stat: (path, cb) => cb(),
          },
        },
        overrides,
      ),
    )
  }
})

test('Should contain error if route does not start with "/"', () => {
  const validate = t.context.getTestSubject()

  return validate(CWD, {
    route: 'test',
    module: 'test',
  }).then((errors) => expect(errors).toEqual(['Route must start with a "/"']));
})

test('Should contain error if timeout is invalid', () => {
  const validate = t.context.getTestSubject()
  const tests = [
    {
      args: { route: '/test', module: 'test', timeout: 0 },
      expected: ['Timeout must be between 1 and 900 (inclusive)'],
    },
    {
      args: { route: '/test', module: 'test', timeout: 901 },
      expected: ['Timeout must be between 1 and 900 (inclusive)'],
    },
    { args: { route: '/test', module: 'test', timeout: 1 }, expected: [] },
    { args: { route: '/test', module: 'test', timeout: 900 }, expected: [] },
  ]

  return tests.reduce((prev, config) => {
    return prev
      .then(() => validate(CWD, config.args))
      .then((result) => expect(result).toEqual(config.expected));
  }, Promise.resolve());
})

test('Should contain error message if module can not be found', () => {
  const errorMessage = 'This is an error'
  const validate = t.context.getTestSubject({
    fs: {
      stat: (path, cb) => cb(new Error(errorMessage)),
    },
  })
  return validate(CWD, {
    route: '/test',
    module: 'test',
  }).then((errors) => expect(errors).toEqual([errorMessage]));
})

test('Should contain different error message if module can not be found with ENOENT code', () => {
  const validate = t.context.getTestSubject({
    fs: {
      stat: (path, cb) => {
        const err = new Error()
        err.code = 'ENOENT'
        cb(err)
      },
    },
  })
  return validate(CWD, {
    route: '/test',
    module: MODULE,
  }).then((errors) => expect(errors).toEqual([`Could not find module: ${MODULE}`]));
})

test('Input for for fs.stat() should be the result of path.resolve()', () => {
  expect.assertions(3)
  const validate = t.context.getTestSubject({
    path: {
      resolve: (cwd, moduleString) => {
        expect(cwd).toBe(CWD)
        expect(moduleString).toBe(MODULE)
        return PATH_RESOLVE
      },
    },
    '@jokeyrhyme/pify-fs': {
      stat: (path) => {
        expect(path).toBe(PATH_RESOLVE)
        return Promise.resolve()
      },
    },
    fs: {
      stat: (path, cb) => {
        expect(path).toBe(PATH_RESOLVE)
        cb()
      },
    },
  })
  return validate(CWD, {
    route: '/test',
    module: MODULE,
  })
})
