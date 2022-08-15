import { describe, expect, test } from '@jest/globals'

import getAwsCredentials from '../../src/cdn/aws-credentials.js'
import OneBlinkAPIClient from '../../src/oneblink-api-client.js'

describe('aws credentials', () => {
  const CFG = {
    objectParams: {
      ACL: 'public-read',
      Expires: 60,
    },
    region: 'ap-southeast-2',
    scope: 'customer-project.blinkm.io',
    service: {
      origin: 'http://localhost',
    },
  }

  test('it should resolve aws credentials', async () => {
    const Credentials = {
      AccessKeyId: 'id',
      SecretAccessKey: 'secret',
      SessionToken: 'token',
    }

    const oneBlinkAPIClient: OneBlinkAPIClient = {
      // @ts-expect-error not mocking the entire class
      postRequest: async () => ({
        Credentials,
      }),
    }

    const credentials = await getAwsCredentials(CFG, 'dev', oneBlinkAPIClient)
    expect(credentials.accessKeyId).toBe(Credentials.AccessKeyId)
    expect(credentials.secretAccessKey).toBe(Credentials.SecretAccessKey)
    expect(credentials.sessionToken).toBe(Credentials.SessionToken)
  })

  test('it should reject and stop the spinner if request for aws credentials fails', async () => {
    // @ts-expect-error not mocking the entire class
    const oneBlinkAPIClient: OneBlinkAPIClient = {
      postRequest: async () => {
        throw new Error('test error')
      },
    }
    const promise = getAwsCredentials(CFG, 'dev', oneBlinkAPIClient)

    await expect(promise).rejects.toThrow('test error')
  })
})
