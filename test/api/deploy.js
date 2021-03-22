'use strict'

const fs = require('fs')
const path = require('path')

const yauzl = require('yauzl')

const TEST_SUBJECT = '../../lib/api/deploy.js'

const UPLOAD_PATH = path.join(__dirname, 'fixtures', 'upload', 'project.zip')
const ZIP_PATH = path.join(__dirname, 'fixtures', 'zip')
const BUNDLE_KEY = 'this is a file key'
const BUNDLE_BUCKET = 'this is a file bucket'
const ENV = 'test'

beforeEach(() => {
  t.context.getTestSubject = (overrides) => {
    overrides = overrides || {}
    return proxyquire(TEST_SUBJECT, Object.assign({}, overrides))
  }
})

test('confirm() should not prompt or log if force is true', done => {
  const deploy = t.context.getTestSubject({
    inquirer: {
      prompt: () => done.fail('Should not call prompt'),
    },
  })
  return deploy
    .confirm({ log: () => done.fail('Should not log') }, true)
    .then(() => );
})

test('confirm() should prompt and log if force is false', () => {
  expect.assertions(2)
  const deploy = t.context.getTestSubject({
    inquirer: {
      prompt: () => {
        return Promise.resolve({
          confirmation: true,
        })
      },
    },
  })
  return deploy.confirm({ log: () =>  }, false);
})

test('authenticate() should call oneblinkIdentity functions and stop updates', () => {
  expect.assertions(1)
  const deploy = t.context.getTestSubject()
  return deploy.authenticate(
    {
      postRequest: () => {
        return Promise.resolve({ credentials: {} })
      },
    },
    {},
    ENV,
  );
})

test('authenticate() should call log correct updates if oneblinkIdentity functions throw errors', () => {
  expect.assertions(1)
  const deploy = t.context.getTestSubject({
    './assume-aws-roles.js': {
      assumeAWSRoleToDeploy: () => Promise.reject(new Error('test error')),
    },
  })
  return deploy
    .authenticate(
      {
        postRequest: () => {
          return Promise.resolve()
        },
      },
      {},
      ENV,
    )
    .catch((err) => expect(err.message).toBe('test error'));
})

test(
  'zip() should log correct updates and return an absolute path to a zip file',
  done => {
    expect.assertions(6)
    const deploy = t.context.getTestSubject({})
    deploy
      .zip(ZIP_PATH)
      .then((zipFilePath) => {
        expect(path.isAbsolute(zipFilePath)).toBeTruthy()
        expect(path.extname(zipFilePath)).toBe('.zip')
        expect(fs.statSync(zipFilePath).isFile()).toBeTruthy()
        yauzl.open(zipFilePath, { lazyEntries: true }, (err, zip) => {
          if (err) {
            done()
            return
          }
          const entries = []
          zip.on('entry', (entry) => {
            entries.push(entry.fileName)
            zip.readEntry()
          })
          zip.on('end', () => {
            expect(entries.some((entry) => entry === '.blinkmrc.json')).toBeTruthy()
            expect(entries.some((entry) => entry === 'bm-server.json')).toBeTruthy()
            expect(entries.some((entry) => entry === 'helloworld/index.js')).toBeTruthy()
            done()
          })
          zip.on('error', () => done())
          zip.readEntry()
        })
      })
      .catch(() => done())
  }
)

test('zip() should log correct updates and reject if an temp emits an error', () => {
  expect.assertions(2)
  const deploy = t.context.getTestSubject({
    archiver: {
      create: () => ({
        on: () => {},
        pipe: () => {},
        glob: () => {},
        finalize: () => {},
      }),
    },
    temp: {
      track: () => ({
        mkdir: () => {},
        createWriteStream: (options) => {
          expect(options).toEqual({ suffix: '.zip' })
          return {
            on: (str, fn) => {
              if (str === 'error') {
                fn(new Error('test temp error'))
              }
            },
          }
        },
      }),
    },
  })
  return t.throwsAsync(() => deploy.zip(ZIP_PATH), {
    message: 'test temp error',
  })
})

test('zip() should log correct updates and reject if an archiver emits an error', () => {
  expect.assertions(1)
  const deploy = t.context.getTestSubject({
    archiver: {
      create: () => ({
        on: (str, fn) => {
          if (str === 'error') {
            fn(new Error('test archiver error'))
          }
        },
        pipe: () => {},
        glob: () => {},
        finalize: () => {},
      }),
    },
    temp: {
      track: () => ({
        mkdir: () => {},
        createWriteStream: () => ({
          on: () => {},
        }),
      }),
    },
  })
  return t.throwsAsync(() => deploy.zip(ZIP_PATH), {
    message: 'test archiver error',
  })
})

test('upload() should log correct updates and return bundle key after upload', () => {
  expect.assertions(2)
  const deploy = t.context.getTestSubject({
    'aws-sdk': {
      config: {},
      S3: function () {
        this.upload = (params) => {
          expect(params.Bucket).toBe(BUNDLE_BUCKET)
          expect(params.Key).toBe(BUNDLE_KEY)
          return {
            on: () => {},
            send: (fn) => fn(null, { Key: BUNDLE_KEY }),
          }
        }
      },
    },
  })
  return deploy
    .upload(UPLOAD_PATH, {
      credentials: {},
      s3: { bucket: BUNDLE_BUCKET, key: BUNDLE_KEY, region: 'string' },
    })
    .catch(t.fail)
})

test('upload() should log correct updates and reject if upload returns an error', () => {
  expect.assertions(1)
  const deploy = t.context.getTestSubject({
    'aws-sdk': {
      config: {},
      S3: function () {
        this.upload = () => ({
          on: () => {},
          send: (fn) => fn(new Error('test upload error')),
        })
      },
    },
  })
  return t.throwsAsync(
    () =>
      deploy.upload(UPLOAD_PATH, {
        credentials: {},
        s3: { bucket: 'string', key: 'string', region: 'string' },
      }),
    { message: 'test upload error' },
  )
})

test('deploy() should log correct updates', () => {
  expect.assertions(2)
  const deploy = t.context.getTestSubject()
  return deploy.deploy(
    {
      postRequest: (path, body) => {
        expect(path).toBe(`/apis/${body.scope}/environments/${ENV}/deployments`)
        expect(body).toEqual({
          payload: '123',
          scope: 'scope',
        })
        return Promise.resolve({ brandedUrl: 'https://example.com' })
      },
    },
    { payload: '123', scope: 'scope' },
    ENV,
  );
})

test('deploy() should log correct updates and reject if request() returns an error', () => {
  expect.assertions(1)
  const deploy = t.context.getTestSubject()
  return t.throwsAsync(
    () =>
      deploy.deploy(
        {
          postRequest: () => {
            return Promise.reject(new Error('test error'))
          },
        },
        {},
        ENV,
      ),
    { message: 'test error' },
  )
})
