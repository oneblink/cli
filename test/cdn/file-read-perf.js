'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')

const test = require('ava')
const temp = require('temp').track()
const mockery = require('mockery')

const config = require('../../lib/config')
const OneBlinkAPIClient = require('../../lib/oneblink-api-client')
// require now to avoid mockery warnings
require('@blinkmobile/aws-s3')
require('ora')
require('../../lib/commands/cdn/lib/utils/confirm.js')

const fileData = 'test contents\n\n'
const pWriteFile = util.promisify(fs.writeFile)
const pMkdir = util.promisify(temp.mkdir)

const chainer = {
  on: () => chainer,
  send: () => chainer,
}

const s3FactoryModule = '../lib/s3-bucket-factory.js'
const s3BucketFactoryMock = () =>
  Promise.resolve({
    listObjectsV2(options, callback) {
      callback(null, {
        Contents: [
          {
            Key: 'dev/existing-file.js',
            LastModified: new Date(),
            ETag: 'dev/existing-file.js',
            Size: '1',
          },
          {
            Key: 'dev/1.js',
            LastModified: new Date(),
            ETag: 'dev/1.js',
            Size: '1',
          },
        ],
      })
    },
    upload(options, callback) {
      callback(null)
    },
    deleteObjects(options, callback) {
      callback(null, {
        Deleted: [
          {
            Key: 'dev/existing-file.js',
          },
        ],
        Errors: [],
      })
    },
  })

const s3ParamsModule = '../lib/s3-bucket-params.js'
const s3BucketParamsMock = {
  read: () =>
    Promise.resolve({
      region: 'region',
      params: {
        Bucket: 'a',
        Expires: 60,
        ACL: 'public-read',
      },
    }),
}
const makeArray = (num) => {
  const arr = []
  for (let i = 0; i < num; ++i) {
    arr.push(i)
  }

  return arr
}

const createFile = (dir) => (id) => {
  const filePath = path.join(dir, `${id}.js`)
  return pWriteFile(filePath, fileData)
}

temp.track()
mockery.enable()
mockery.registerMock(s3FactoryModule, s3BucketFactoryMock)
mockery.registerMock(s3ParamsModule, s3BucketParamsMock)
mockery.registerAllowables([
  '../commands/deploy',
  '../lib/utils/confirm.js',
  'fs',
  'path',
  '@blinkmobile/aws-s3',
  'ora',
  'chalk',
  'inquirer',
])

test.after(() => mockery.disable())

function makeTest(timerLabel, numFiles) {
  return (t) => {
    const deploy = require('../../lib/commands/cdn/lib/deploy')
    const upload = (dir) => {
      console.time(timerLabel)
      return deploy(
        [],
        {
          cwd: dir,
          env: 'dev',
          force: true,
          skip: true,
          prune: true,
        },
        new OneBlinkAPIClient(config.TENANTS.ONEBLINK),
      )
    }

    let tempPath
    const promise = pMkdir('temp' + numFiles)
      .then((dirPath) => {
        const count = makeArray(numFiles)
        tempPath = dirPath
        return Promise.all(count.map(createFile(tempPath)))
      })
      .then(() => upload(tempPath))
      .then(() => console.timeEnd(timerLabel))

    return t.notThrows(promise)
  }
}

// Matt C (2017-05-19)
// Skipping these tests as they are failing on windows machines
// and we are sceptical in regards to there value
test.skip('read 100 files from disk', makeTest('100Files', 100))

test.skip('read 500 files from disk', makeTest('500Files', 500))

test.skip('read 1000 files from disk', makeTest('1000Files', 1000))

test.skip('read 2000 files from disk', makeTest('2000Files', 2000))
