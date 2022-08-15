import { describe, expect, test, jest } from '@jest/globals'
import fs from 'fs'
import path from 'path'
import url from 'url'

import yauzl from 'yauzl'

import OneBlinkAPIClient from '../../src/oneblink-api-client.js'
import { TENANTS } from '../../src/config.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

describe('deploy', () => {
  const UPLOAD_PATH = path.join(__dirname, 'fixtures', 'upload', 'project.zip')
  const ZIP_PATH = path.join(__dirname, 'fixtures', 'zip')
  const ENV = 'test'
  const deploymentCredentials = {
    credentials: {
      accessKeyId: 'accessKeyId',
      secretAccessKey: 'secretAccessKey',
      sessionToken: 'sessionToken',
    },
    s3: {
      bucket: 'this is a file bucket',
      key: 'this is a file key',
      region: 'string',
    },
  }
  const apiDeploymentPayload = {
    payload: '123',
    scope: 'scope',
    env: ENV,
    s3: deploymentCredentials.s3,
    timeout: 1,
    cors: true,
    runtime: 'string',
    handler: 'string',
    variables: {},
    routes: [],
    network: undefined,
  }

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('confirm() should not prompt or log if force is true', async () => {
    const spy = jest.spyOn(console, 'log')
    const mockPrompt = jest.fn()
    jest.unstable_mockModule('inquirer', () => ({
      default: {
        prompt: mockPrompt,
      },
    }))
    const { default: deploy } = await import('../../src/api/deploy.js')
    await deploy.confirm(console, true, ENV)
    expect(spy).not.toHaveBeenCalled()
    expect(mockPrompt).not.toHaveBeenCalled()
  })

  test('confirm() should prompt and log if force is false', async () => {
    const spy = jest.spyOn(console, 'log')
    const mockPrompt = jest.fn(async () => ({
      confirmation: true,
    }))
    jest.unstable_mockModule('inquirer', () => ({
      default: {
        prompt: mockPrompt,
      },
    }))
    const { default: deploy } = await import('../../src/api/deploy.js')
    await deploy.confirm(console, false, ENV)
    expect(spy).toHaveBeenCalled()
    expect(mockPrompt).toHaveBeenCalled()
  })

  test('authenticate() should call oneblinkIdentity functions and stop updates', async () => {
    const mockPostRequest = jest.fn(async () => ({
      credentials: {},
    }))
    const oneBlinkAPIClient = new OneBlinkAPIClient(TENANTS.ONEBLINK)
    oneBlinkAPIClient.postRequest =
      mockPostRequest as OneBlinkAPIClient['postRequest']

    const { default: deploy } = await import('../../src/api/deploy.js')

    await deploy.authenticate(oneBlinkAPIClient, {}, ENV)
    expect(mockPostRequest).toBeCalled()
  })

  test('authenticate() should call log correct updates if oneblinkIdentity functions throw errors', async () => {
    const oneBlinkAPIClient = new OneBlinkAPIClient(TENANTS.ONEBLINK)
    jest.unstable_mockModule('api/assume-aws-roles', () => ({
      default: {
        assumeAWSRoleToDeploy: async () => {
          throw new Error('test error')
        },
      },
    }))
    const { default: deploy } = await import('../../src/api/deploy.js')

    const promise = deploy.authenticate(oneBlinkAPIClient, {}, ENV)
    await expect(promise).rejects.toThrow('test error')
  })

  test('zip() should log correct updates and return an absolute path to a zip file', async () => {
    expect.assertions(6)
    const { default: deploy } = await import('../../src/api/deploy.js')
    const zipFilePath = await deploy.zip(ZIP_PATH)
    if (typeof zipFilePath !== 'string') {
      fail('"zipFilePath" must be string')
    }
    expect(path.isAbsolute(zipFilePath)).toBeTruthy()
    expect(path.extname(zipFilePath)).toBe('.zip')
    expect(fs.statSync(zipFilePath).isFile()).toBeTruthy()

    await new Promise((resolve, reject) => {
      yauzl.open(zipFilePath, { lazyEntries: true }, (err, zip) => {
        if (err || !zip) {
          reject(err)
          return
        }
        const entries: string[] = []
        zip.on('entry', (entry) => {
          entries.push(entry.fileName)
          zip.readEntry()
        })
        zip.on('end', () => {
          expect(
            entries.some((entry) => entry === '.blinkmrc.json'),
          ).toBeTruthy()
          expect(
            entries.some((entry) => entry === 'bm-server.json'),
          ).toBeTruthy()
          expect(
            entries.some((entry) => entry === 'helloworld/index.js'),
          ).toBeTruthy()
          resolve(undefined)
        })
        zip.on('error', (e) => reject(e))
        zip.readEntry()
      })
    })
  })

  test('zip() should log correct updates and reject if an temp emits an error', async () => {
    jest.mock('archiver', () => ({
      create: () => ({
        on: () => undefined,
        pipe: () => undefined,
        glob: () => undefined,
        finalize: () => undefined,
      }),
    }))
    const mockCreateWriteStream = jest.fn()
    mockCreateWriteStream.mockImplementation(() => {
      return {
        on: (str: string, fn: (error: Error) => void) => {
          if (str === 'error') {
            fn(new Error('test temp error'))
          }
        },
      }
    })
    jest.mock('temp', () => ({
      track: () => undefined,
      mkdir: (directory: string, cb: (error?: Error) => void) => cb(),
      createWriteStream: mockCreateWriteStream,
    }))
    const { default: deploy } = await import('../../src/api/deploy.js')

    const promise = deploy.zip(ZIP_PATH)
    await expect(promise).rejects.toThrow('test temp error')
    expect(mockCreateWriteStream).toBeCalledWith({ suffix: '.zip' })
  })

  test('zip() should log correct updates and reject if an archiver emits an error', async () => {
    jest.mock('archiver', () => ({
      create: () => ({
        on: (str: string, fn: (error: Error) => void) => {
          if (str === 'error') {
            fn(new Error('test archiver error'))
          }
        },
        pipe: () => undefined,
        glob: () => undefined,
        finalize: () => undefined,
      }),
    }))
    jest.mock('temp', () => ({
      track: () => undefined,
      mkdir: (directory: string, cb: (error?: Error) => void) => cb(),
      createWriteStream: () => ({
        on: () => undefined,
      }),
    }))

    const { default: deploy } = await import('../../src/api/deploy.js')

    const promise = deploy.zip(ZIP_PATH)
    await expect(promise).rejects.toThrow('test archiver error')
  })

  test('upload() should log correct updates and return bundle key after upload', async () => {
    const mockUpload = jest.fn()
    mockUpload.mockReturnValue({
      on: () => undefined,
      send: (fn: (error: null, result: { Key: string }) => void) =>
        fn(null, { Key: deploymentCredentials.s3.key }),
    })
    jest.mock('aws-sdk', () => ({
      S3: class {
        upload = mockUpload
      },
    }))
    const { default: deploy } = await import('../../src/api/deploy.js')

    await deploy.upload(UPLOAD_PATH, deploymentCredentials)
    expect(mockUpload).toBeCalledWith(
      expect.objectContaining({
        Bucket: deploymentCredentials.s3.bucket,
        Key: deploymentCredentials.s3.key,
      }),
    )
  })

  test('upload() should log correct updates and reject if upload returns an error', async () => {
    jest.mock('aws-sdk', () => ({
      S3: class {
        upload() {
          return {
            on: () => undefined,
            send: (fn: (error: Error) => void) =>
              fn(new Error('test upload error')),
          }
        }
      },
    }))
    const { default: deploy } = await import('../../src/api/deploy.js')

    const promise = deploy.upload(UPLOAD_PATH, deploymentCredentials)
    expect(promise).rejects.toThrow('test upload error')
  })

  test('deploy() should log correct updates', async () => {
    const mockPostRequest = jest.fn(async () => ({
      credentials: {},
    }))
    const oneBlinkAPIClient = new OneBlinkAPIClient(TENANTS.ONEBLINK)
    oneBlinkAPIClient.postRequest =
      mockPostRequest as OneBlinkAPIClient['postRequest']
    const { default: deploy } = await import('../../src/api/deploy.js')
    await deploy.deploy(oneBlinkAPIClient, apiDeploymentPayload, ENV)
    expect(mockPostRequest).toHaveBeenCalledWith(
      `/apis/${apiDeploymentPayload.scope}/environments/${ENV}/deployments`,
      apiDeploymentPayload,
    )
  })

  test('deploy() should log correct updates and reject if request() returns an error', async () => {
    const oneBlinkAPIClient = new OneBlinkAPIClient(TENANTS.ONEBLINK)
    oneBlinkAPIClient.postRequest = async () => {
      throw new Error('test error')
    }
    const { default: deploy } = await import('../../src/api/deploy.js')
    const promise = deploy.deploy(oneBlinkAPIClient, apiDeploymentPayload, ENV)
    expect(promise).rejects.toThrow('test error')
  })
})
