import { describe, expect, test, jest } from '@jest/globals'

describe('validate', () => {
  const CWD = 'current working directory'
  const PATH_RESOLVE = 'returned from path resolve'
  const MODULE = 'module path'

  beforeEach(() => {
    jest.unstable_mockModule('path', () => ({
      default: {
        resolve: () => PATH_RESOLVE,
      },
    }))
    jest.unstable_mockModule('fs/promises', () => ({
      default: {
        stat: async (path: string) => undefined,
      },
    }))
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('Should contain error if name does not consist of lowercase letters and dashes', async () => {
    const { default: validate } = await import(
      '../../../src/api/scheduledFunctions/validate.js'
    )

    const errors = await validate(CWD, {
      name: 'TEST',
      label: 'test',
      module: 'test',
      export: 'run',
      timeout: 1,
      retryOnFail: true,
    })
    expect(errors).toEqual([
      '"name" can only include lowercase letters and dashes',
    ])
  })

  test('Should contain error if timeout is invalid', async () => {
    const { default: validate } = await import(
      '../../../src/api/scheduledFunctions/validate.js'
    )
    const tests = [
      {
        args: {
          name: 'test',
          label: 'test',
          module: 'test',
          timeout: 0,
          export: 'run',
          retryOnFail: true,
        },
        expected: ['"timeout" must be between 1 and 900 (inclusive)'],
      },
      {
        args: {
          name: 'test',
          label: 'test',
          module: 'test',
          timeout: 901,
          export: 'run',
          handler: 'test.run',
          retryOnFail: false,
        },
        expected: ['"timeout" must be between 1 and 900 (inclusive)'],
      },
      {
        args: {
          name: 'test',
          label: 'test',
          module: 'test',
          timeout: 1,
          export: 'run',
          retryOnFail: true,
        },
        expected: [],
      },
      {
        args: {
          name: 'test',
          label: 'test',
          module: 'test',
          timeout: 900,
          export: 'run',
          retryOnFail: false,
        },
        expected: [],
      },
    ]

    for (const { args, expected } of tests) {
      const result = await validate(CWD, args)
      expect(result).toEqual(expected)
    }
  })

  test('Should contain error message if module can not be found', async () => {
    const errorMessage = 'This is an error'
    jest.unstable_mockModule('fs/promises', () => ({
      default: {
        stat: async (path: string) => {
          throw new Error(errorMessage)
        },
      },
    }))
    const { default: validate } = await import(
      '../../../src/api/scheduledFunctions/validate.js'
    )
    const result = await validate(CWD, {
      name: 'test',
      label: 'test',
      module: 'test',
      export: 'run',
      timeout: 1,
      retryOnFail: false,
    })
    expect(result).toEqual([errorMessage])
  })

  test('Should contain error message if retryOnFail not a boolean', async () => {
    const { default: validate } = await import(
      '../../../src/api/scheduledFunctions/validate.js'
    )
    const result = await validate(CWD, {
      name: 'test',
      label: 'test',
      module: 'test',
      export: 'run',
      timeout: 1,
      //@ts-expect-error deliberately wrong
      retryOnFail: 'false',
    })
    expect(result).toEqual(['"retryOnFail" must be either true or false'])
  })

  test('Should contain different error message if module can not be found with ENOENT code', async () => {
    jest.unstable_mockModule('fs/promises', () => ({
      default: {
        stat: async (path: string) => {
          const error = new Error('This is an error')
          // @ts-expect-error we are adding the property, you don't get a say typescript
          error.code = 'ENOENT'
          throw error
        },
      },
    }))
    const { default: validate } = await import(
      '../../../src/api/scheduledFunctions/validate.js'
    )
    const errors = await validate(CWD, {
      name: 'test',
      label: 'test',
      module: MODULE,
      export: 'run',
      timeout: 1,
      retryOnFail: true,
    })
    expect(errors).toEqual([`Could not find module: ${MODULE}`])
  })

  test('Input for for fs.stat() should be the result of path.resolve()', async () => {
    const mockResolve = jest.fn()
    mockResolve.mockReturnValue(PATH_RESOLVE)
    jest.unstable_mockModule('path', () => ({
      default: {
        resolve: mockResolve,
      },
    }))
    const mockStat = jest.fn(async (path: string) => undefined)
    jest.unstable_mockModule('fs/promises', () => ({
      default: {
        stat: mockStat,
      },
    }))

    const { default: validate } = await import(
      '../../../src/api/scheduledFunctions/validate.js'
    )

    await validate(CWD, {
      name: 'test',
      label: 'test',
      module: MODULE,
      export: 'run',
      timeout: 1,
      retryOnFail: true,
    })

    expect(mockResolve).toBeCalledWith(CWD, MODULE)
    expect(mockStat.mock.calls[0][0]).toBe(PATH_RESOLVE)
  })
})
