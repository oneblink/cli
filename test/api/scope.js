'use strict'

const TEST_SUBJECT = '../../lib/api/scope.js'
const CWD = 'current working directory'
const CFG = {
  server: {
    project: 'name of project',
    region: 'name of region',
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
            read: () => Promise.resolve(CFG),
            write: () => Promise.resolve(),
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

test('read() should call projectMeta.read() with correct input', () => {
  expect.assertions(1)
  const scope = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: (cwd) => {
        expect(cwd).toBe(CWD)
        return Promise.resolve(CFG)
      },
    },
  })

  return scope.read(CWD)
})

test('read() should handle an unitinitalised config file', () => {
  expect.assertions(1)
  const scope = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: () => Promise.resolve(null),
    },
  })
  return scope.read().then((cfg) => expect(cfg).toEqual({}));
})

test('read() should return the currently set scope', () => {
  const scope = t.context.getTestSubject()

  return scope.read(CWD).then((server) => expect(server).toEqual(CFG.server));
})

test('read() should reject if projectMeta.read() throws an error', () => {
  expect.assertions(2)
  const scope = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: () => {
        return Promise.reject(new Error())
      },
    },
  })

  return scope.read(CWD).catch(() => );
})

test('display() should call projectMeta.read() with correct input', () => {
  expect.assertions(1)
  const scope = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: (cwd) => {
        expect(cwd).toBe(CWD)
        return Promise.resolve(CFG)
      },
    },
  })

  return scope.display(t.context.logger, CWD)
})

test('display() should reject with nice error message if projectMeta.read() throws an error', () => {
  const scope = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: () => Promise.reject(new Error('test error message')),
    },
  })

  return t.throwsAsync(() => scope.display(t.context.logger, CWD), {
    message:
      'Scope has not been set yet, see --help for information on how to set scope.',
  })
})

test('display() should reject with nice error message if scope has not been set', () => {
  const scope = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: () => Promise.resolve(null),
    },
  })

  return t.throwsAsync(() => scope.display(t.context.logger, CWD), {
    message:
      'Scope has not been set yet, see --help for information on how to set scope.',
  })
})

test('display() should log the currently set scope', () => {
  expect.assertions(1)
  const scope = t.context.getTestSubject()

  return scope.display({ log: () =>  }, CWD);
})

test('write() should reject if project is not set on the meta object', () => {
  const scope = t.context.getTestSubject()

  return t.throwsAsync(() => scope.write(CWD, null), {
    message: 'meta.project was not defined.',
  })
})

test('write() should merge new scope with the current config', () => {
  expect.assertions(2)
  const originalConfig = {
    bmp: {
      scope: 'blah',
    },
    server: {
      project: 'old',
    },
    extra: 'existing',
  }
  const newConfig = {
    project: 'new project',
    tenant: 'oneblink',
  }
  const scope = t.context.getTestSubject({
    './utils/project-meta.js': {
      write: (cwd, updater) => {
        expect(cwd).toBe(CWD)
        return Promise.resolve(updater(originalConfig))
      },
    },
  })

  return scope.write(CWD, newConfig).then((config) =>
    expect(config).toEqual({
      project: 'new project',
    }),
  );
})
