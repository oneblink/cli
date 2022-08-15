import { describe, expect, test } from '@jest/globals'

import provision from '../../src/cdn/provision-environment.js'
import OneBlinkAPIClient from '../../src/oneblink-api-client.js'

describe('provision-environment', () => {
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

  test('it should resolve', async () => {
    const oneBlinkAPIClient: OneBlinkAPIClient = {
      // @ts-expect-error not mocking the entire class
      postRequest: async () => ({
        brandedUrl: '',
      }),
    }

    const promise = provision(CFG, 'dev', oneBlinkAPIClient)
    await expect(promise).resolves.toBeUndefined()
  })

  test('it should reject and stop the spinner if request fails', async () => {
    // @ts-expect-error not mocking the entire class
    const oneBlinkAPIClient: OneBlinkAPIClient = {
      postRequest: async () => {
        throw new Error('test error')
      },
    }

    const promise = provision(CFG, 'dev', oneBlinkAPIClient)
    await expect(promise).rejects.toThrow('test error')
  })
})
