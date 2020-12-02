'use strict'

const path = require('path')

const test = require('ava')
const read = require('../../lib/commands/cdn/lib/read')
const show = require('../../lib/commands/cdn/lib/show')
const write = require('../../lib/commands/cdn/lib/write')

const EXISTING_PROJECT_PATH = path.join(
  __dirname,
  'fixtures',
  'existing-project',
)
const UNITINITALISED_PROJECT_PATH = path.join(
  __dirname,
  'fixtures',
  'unitinitalised-project',
)
const MERGE_OPTIONS_PROJECT_PATH = path.join(
  __dirname,
  'fixtures',
  'merge-project',
)

test('it should return the currently set scope', (t) => {
  return read(EXISTING_PROJECT_PATH).then((s) => {
    t.is(s.scope, 'customer-project.blinkm.io')
  })
})

test('it should log the currently set scope', (t) => {
  return t.notThrows(() => {
    show(EXISTING_PROJECT_PATH)
  })
})

test('it should handle an unitinitalised config file', (t) => {
  return read(UNITINITALISED_PROJECT_PATH).then((s) => t.is(s.scope, undefined))
})

test('it should reject if no scope is set', (t) => {
  const p = write('.', '')
  return t.throwsAsync(() => p, 'Scope was not defined.')
})

test('it should merge new scope with the current config', (t) => {
  return write(MERGE_OPTIONS_PROJECT_PATH, 'c').then((config) => {
    t.not(config.cdn.scope, 'old')
    t.is(config.cdn.scope, 'c')
    t.is(config.cdn.extra, 'existing')
    return write(MERGE_OPTIONS_PROJECT_PATH, 'old')
  })
})
