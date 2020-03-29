'use strict'

const path = require('path')

const test = require('ava')
const proxyquire = require('proxyquire')

const pkg = require('../../../package.json')

const TEST_SUBJECT = '../../../lib/api/utils/project-meta.js'
const CWD = path.join(__dirname, '..', 'fixtures', 'project-meta')

test.beforeEach((t) => {
  t.context.getTestSubject = (overrides) => {
    overrides = overrides || {}
    return proxyquire(TEST_SUBJECT, overrides || {})
  }
})

test('projectConfig() call configLoader with correct input', (t) => {
  t.plan(1)
  const projectMeta = t.context.getTestSubject({
    '@blinkmobile/blinkmrc': {
      projectConfig: (options) =>
        t.deepEqual(options, {
          name: pkg.name,
          cwd: CWD,
        }),
    },
  })

  projectMeta.projectConfig(CWD)
})

test('read() should return empty object if load() rejects', (t) => {
  const projectMeta = t.context.getTestSubject({
    '@blinkmobile/blinkmrc': {
      projectConfig: () => ({
        load: () => Promise.reject(new Error()),
      }),
    },
  })

  return projectMeta.read(CWD).then((meta) => t.deepEqual(meta, {}))
})

test('read() should return contents of .blinkmrc.json file', (t) => {
  const projectMeta = t.context.getTestSubject()

  return projectMeta.read(CWD).then((meta) =>
    t.deepEqual(meta, {
      'project-meta': 'test',
    }),
  )
})

test('write() should call the updater function passed', (t) => {
  let updaterCalled = false
  const projectMeta = t.context.getTestSubject({
    '@blinkmobile/blinkmrc': {
      projectConfig: () => ({
        update: (updater) => {
          updater()
          return Promise.resolve()
        },
      }),
    },
  })

  return projectMeta
    .write(CWD, () => {
      updaterCalled = true
    })
    .then(() => t.truthy(updaterCalled))
})
