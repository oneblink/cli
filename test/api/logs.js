/* @flow */
'use strict'

/* ::
import type {
  CLIFlags,
  CLIOptions
} from '../../lib/api/types.js'
*/

const path = require('path')

const test /* : Function */ = require('ava')
const proxyquire /* : (string, { [id:string]: any }) => (Tenant, Array<string>, CLIFlags, typeof console, CLIOptions) => Promise<void> */ = require('proxyquire')

const config = require('../../lib/config')
const BlinkMobileIdentityMock = require('./fixtures/blink-mobile-identity.js')
const createCliFlags = require('./fixtures/create-cli-flags.js')

const TEST_SUBJECT = '../../lib/commands/api/logs.js'
const DIRECTORY_DIR = path.join(
  __dirname,
  '..',
  '..',
  'examples',
  'api',
  'directory',
)
const CLI_OPTIONS = {
  blinkMobileIdentity: new BlinkMobileIdentityMock(),
}

test('should call "serverless logs" with correct arguments and options', t => {
  t.plan(5)
  const logs = proxyquire(TEST_SUBJECT, {
    '../../api/logs.js': {
      authenticate: () => CLI_OPTIONS.blinkMobileIdentity.assumeAWSRole(),
    },
    '../../api/serverless.js': {
      executeSLSCommand: (args, options) => {
        t.deepEqual(args, [
          'logs',
          '--function',
          'example-api-oneblink-io-prod',
          '--region',
          'ap-southeast-2',
          '--stage',
          'prod',
          '--tail',
          '--filter',
          'my custom filter',
          '--startTime',
          '2016',
        ])
        t.is(options.stdio, 'inherit')
        t.is(options.env.AWS_ACCESS_KEY_ID, 'access key id')
        t.is(options.env.AWS_SECRET_ACCESS_KEY, 'secret access key')
        t.is(options.env.AWS_SESSION_TOKEN, 'session token')
        return Promise.resolve()
      },
    },
  })
  return logs(
    config.TENANTS.ONEBLINK,
    [],
    createCliFlags({
      cwd: DIRECTORY_DIR,
      env: 'prod',
      tail: true,
      filter: 'my custom filter',
      startTime: '2016',
    }),
    console,
    CLI_OPTIONS,
  )
})

test('should reject if "serverless logs" fails', t => {
  const logs = proxyquire(TEST_SUBJECT, {
    '../../api/logs.js': {
      authenticate: () => CLI_OPTIONS.blinkMobileIdentity.assumeAWSRole(),
    },
    '../../api/serverless.js': {
      executeSLSCommand: (args, options) =>
        Promise.reject(new Error('error message')),
    },
  })
  return t.throwsAsync(
    () =>
      logs(
        config.TENANTS.ONEBLINK,
        [],
        createCliFlags({
          cwd: DIRECTORY_DIR,
          env: 'prod',
        }),
        console,
        CLI_OPTIONS,
      ),
    'See Serverless Error above for more details.',
  )
})
