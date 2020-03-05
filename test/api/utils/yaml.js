'use strict'

const fs = require('fs')
const path = require('path')

const pify = require('pify')
const temp = require('temp').track()
const test = require('ava')

const fixturePath = path.join(
  __dirname,
  '..',
  'fixtures',
  'yaml',
  'serverless.yml',
)

const readYamlFile = require('../../../lib/api/utils/yaml.js').readYamlFile
const updateYamlFile = require('../../../lib/api/utils/yaml.js').updateYamlFile

let tempPath

test.before(() => {
  tempPath = temp.path({ suffix: 'yml' })
  return pify(fs.readFile)(fixturePath).then(contents =>
    pify(fs.writeFile)(tempPath, contents),
  )
})

test.after.always(() => {
  return pify(fs.unlink)(tempPath)
})

test('readYamlFile()', t => {
  return readYamlFile(fixturePath).then(config => {
    t.is(config.service, 'aws-nodejs')
  })
})

test('updateYamlFile()', t => {
  return updateYamlFile(tempPath, data =>
    Object.assign(data, {
      test: { hello: 'world!' },
    }),
  )
    .then(() => readYamlFile(tempPath))
    .then(data => {
      t.deepEqual(data.test, { hello: 'world!' })
    })
})
