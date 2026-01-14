import { describe, expect, test } from 'vitest'
import validate from '../../../src/api/cors/validate.js'

describe('validate', () => {
  const HELP = ', see documentation for information on how to configure cors.'

  test('Should reject if cors is not truthy', async () => {
    const promise = validate(undefined)
    await expect(promise).rejects.toThrow(
      'Must specify cors configuration' + HELP,
    )
  })

  test('Should reject if origins is undefined or is not an array', async () => {
    expect.assertions(5)
    const configs = [
      {},
      { origins: 'test' },
      { origins: 123 },
      { origins: true },
      { origins: {} },
    ]
    for (const config of configs) {
      // @ts-expect-error we are internationally passing invalid values here
      const promise = validate(config)
      await expect(promise).rejects.toThrow(
        'Must specify at least a single allowable origin in cors configuration' +
          HELP,
      )
    }
  })

  test('Should reject if origins is an empty array', async () => {
    const promise = validate({
      origins: [],
    })
    await expect(promise).rejects.toThrow(
      'Must specify at least a single allowable origin in cors configuration' +
        HELP,
    )
  })

  test('Should reject if origins contains invalid urls', async () => {
    const promise = validate({
      origins: ['test', '123'],
    })
    await expect(promise).rejects.toThrow(
      'The following origins in cors configuration are not valid: test, 123',
    )
  })

  test('Should reject if headers is defined but not as an array', async () => {
    expect.assertions(4)
    const configs = [
      { origins: ['https://test'], headers: 'test' },
      { origins: ['https://test'], headers: 123 },
      { origins: ['https://test'], headers: true },
      { origins: ['https://test'], headers: {} },
    ]
    for (const config of configs) {
      // @ts-expect-error we are internationally passing invalid values here
      const promise = validate(config)
      await expect(promise).rejects.toThrow(
        'Headers must be an array of strings in cors configuration' + HELP,
      )
    }
  })

  test('Should reject if exposed headers is defined but not as an array', async () => {
    expect.assertions(4)
    const configs = [
      { origins: ['https://test'], exposedHeaders: 'test' },
      { origins: ['https://test'], exposedHeaders: 123 },
      { origins: ['https://test'], exposedHeaders: true },
      { origins: ['https://test'], exposedHeaders: {} },
    ]
    for (const config of configs) {
      // @ts-expect-error we are internationally passing invalid values here
      const promise = validate(config)
      await expect(promise).rejects.toThrow(
        'Exposed headers must be an array of strings in cors configuration' +
          HELP,
      )
    }
  })

  test('Should reject if max age is not a number', async () => {
    expect.assertions(4)
    const configs = [
      { origins: ['https://test'], maxAge: 'test' },
      { origins: ['https://test'], maxAge: true },
      { origins: ['https://test'], maxAge: [] },
      { origins: ['https://test'], maxAge: {} },
    ]
    for (const config of configs) {
      // @ts-expect-error we are internationally passing invalid values here
      const promise = validate(config)
      await expect(promise).rejects.toThrow(
        'Max age must be a number in cors configuration' + HELP,
      )
    }
  })

  test('Should reject if credentials is not a boolean', async () => {
    expect.assertions(4)
    const configs = [
      { origins: ['https://test'], maxAge: 1, credentials: 'test' },
      { origins: ['https://test'], maxAge: 1, credentials: 123 },
      { origins: ['https://test'], maxAge: 1, credentials: [] },
      { origins: ['https://test'], maxAge: 1, credentials: {} },
    ]
    for (const config of configs) {
      // @ts-expect-error we are internationally passing invalid values here
      const promise = validate(config)
      await expect(promise).rejects.toThrow(
        'Credentials must be a boolean in cors configuration' + HELP,
      )
    }
  })

  test('Should resolve input if all cors is valid', async () => {
    const cors = {
      origins: ['https://test'],
      headers: ['test'],
      exposedHeaders: ['test'],
      maxAge: 1,
      credentials: true,
    }
    const validated = await validate(cors)
    expect(validated).toEqual(cors)
  })
})
