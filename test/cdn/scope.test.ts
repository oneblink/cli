import path from 'path'

import read from '../../src/cdn/read'
import show from '../../src/cdn/show'
import write from '../../src/cdn/write'

const EXISTING_PROJECT_PATH = path.join(
  __dirname,
  'fixtures',
  'existing-project',
)
const UNINITIALIZED_PROJECT_PATH = path.join(
  __dirname,
  'fixtures',
  'uninitialized-project',
)
const MERGE_OPTIONS_PROJECT_PATH = path.join(
  __dirname,
  'fixtures',
  'merge-project',
)

test('it should return the currently set scope', async () => {
  const s = await read(EXISTING_PROJECT_PATH)
  expect(s.scope).toBe('customer-project.blinkm.io')
})

test('it should log the currently set scope', async () => {
  const promise = show(EXISTING_PROJECT_PATH)
  await expect(promise).resolves.toBeUndefined()
})

test('it should handle an uninitialized config file', async () => {
  const s = await read(UNINITIALIZED_PROJECT_PATH)
  expect(s.scope).toBeUndefined()
})

test('it should reject if no scope is set', async () => {
  const promise = write('.', '')
  await expect(promise).rejects.toThrow('Scope was not defined.')
})

test('it should merge new scope with the current config', async () => {
  const config = await write(MERGE_OPTIONS_PROJECT_PATH, 'c')
  expect(config.cdn.scope).not.toBe('old')
  expect(config.cdn.scope).toBe('c')
  expect(config.cdn.extra).toBe('existing')
  await write(MERGE_OPTIONS_PROJECT_PATH, 'old')
})
