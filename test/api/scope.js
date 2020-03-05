// @flow
'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')

const TEST_SUBJECT = '../../lib/api/scope.js'
const CWD = 'current working directory'
const CFG = {
  server: {
    project: 'name of project',
    region: 'name of region',
  },
}

test.beforeEach(t => {
  t.context.getTestSubject = overrides => {
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

test('read() should call projectMeta.read() with correct input', t => {
  t.plan(1)
  const scope = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: cwd => {
        t.is(cwd, CWD)
        return Promise.resolve(CFG)
      },
    },
  })

  return scope.read(CWD)
})

test('read() should handle an unitinitalised config file', t => {
  t.plan(1)
  const scope = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: cwd => Promise.resolve(null),
    },
  })
  return scope.read().then(cfg => t.deepEqual(cfg, {}))
})

test('read() should return the currently set scope', t => {
  const scope = t.context.getTestSubject()

  return scope.read(CWD).then(server => t.deepEqual(server, CFG.server))
})

test('read() should reject if projectMeta.read() throws an error', t => {
  t.plan(2)
  const scope = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: cwd => {
        t.pass()
        return Promise.reject(new Error())
      },
    },
  })

  return scope.read(CWD).catch(() => t.pass())
})

test('display() should call projectMeta.read() with correct input', t => {
  t.plan(1)
  const scope = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: cwd => {
        t.is(cwd, CWD)
        return Promise.resolve(CFG)
      },
    },
  })

  return scope.display(t.context.logger, CWD)
})

test('display() should reject with nice error message if projectMeta.read() throws an error', t => {
  const scope = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: cwd => Promise.reject(new Error('test error message')),
    },
  })

  return t.throwsAsync(
    () => scope.display(t.context.logger, CWD),
    'Scope has not been set yet, see --help for information on how to set scope.',
  )
})

test('display() should reject with nice error message if scope has not been set', t => {
  const scope = t.context.getTestSubject({
    './utils/project-meta.js': {
      read: cwd => Promise.resolve(null),
    },
  })

  return t.throwsAsync(
    () => scope.display(t.context.logger, CWD),
    'Scope has not been set yet, see --help for information on how to set scope.',
  )
})

test('display() should log the currently set scope', t => {
  t.plan(1)
  const scope = t.context.getTestSubject()

  return scope.display({ log: () => t.pass() }, CWD)
})

test('write() should reject if project is not set on the meta object', t => {
  const scope = t.context.getTestSubject()

  return t.throwsAsync(
    () => scope.write(CWD, null),
    'meta.project was not defined.',
  )
})

test('write() should merge new scope with the current config', t => {
  t.plan(2)
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
        t.is(cwd, CWD)
        return Promise.resolve(updater(originalConfig))
      },
    },
  })

  return scope.write(CWD, newConfig).then(config =>
    t.deepEqual(config, {
      project: 'new project',
      tenant: 'oneblink',
    }),
  )
})
