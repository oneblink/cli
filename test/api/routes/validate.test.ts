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
    jest.unstable_mockModule('fs', () => ({
      default: {
        stat: (path: string, cb: () => void) => {
          cb()
        },
      },
    }))
  })

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('Should contain error if route does not start with "/"', async () => {
    const { default: validate } = await import(
      '../../../src/api/routes/validate'
    )

    const errors = await validate(CWD, {
      route: 'test',
      module: 'test',
    })
    expect(errors).toEqual(['Route must start with a "/"'])
  })

  test('Should contain error if timeout is invalid', async () => {
    const { default: validate } = await import(
      '../../../src/api/routes/validate'
    )
    const tests = [
      {
        args: { route: '/test', module: 'test', timeout: 0 },
        expected: ['Timeout must be between 1 and 900 (inclusive)'],
      },
      {
        args: { route: '/test', module: 'test', timeout: 901 },
        expected: ['Timeout must be between 1 and 900 (inclusive)'],
      },
      { args: { route: '/test', module: 'test', timeout: 1 }, expected: [] },
      { args: { route: '/test', module: 'test', timeout: 900 }, expected: [] },
    ]

    for (const { args, expected } of tests) {
      const result = await validate(CWD, args)
      expect(result).toEqual(expected)
    }
  })

  test('Should contain error message if module can not be found', async () => {
    const errorMessage = 'This is an error'
    jest.unstable_mockModule('fs', () => ({
      default: {
        stat: (path: string, cb: (error: Error | undefined) => void) => {
          cb(new Error(errorMessage))
        },
      },
    }))
    const { default: validate } = await import(
      '../../../src/api/routes/validate'
    )
    const result = await validate(CWD, {
      route: '/test',
      module: 'test',
    })
    expect(result).toEqual([errorMessage])
  })

  test('Should contain different error message if module can not be found with ENOENT code', async () => {
    jest.unstable_mockModule('fs', () => ({
      default: {
        stat: (path: string, cb: (error: Error | undefined) => void) => {
          const error = new Error('This is an error')
          // @ts-expect-error we are adding the property, you don't get a say typescript
          error.code = 'ENOENT'
          cb(error)
        },
      },
    }))
    const { default: validate } = await import(
      '../../../src/api/routes/validate'
    )
    const errors = await validate(CWD, {
      route: '/test',
      module: MODULE,
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
    const mockStat = jest.fn((path: string, cb: () => void) => {
      cb()
    })
    jest.unstable_mockModule('fs', () => ({
      default: {
        stat: mockStat,
      },
    }))

    const { default: validate } = await import(
      '../../../src/api/routes/validate'
    )

    await validate(CWD, {
      route: '/test',
      module: MODULE,
    })

    expect(mockResolve).toBeCalledWith(CWD, MODULE)
    expect(mockStat.mock.calls[0][0]).toBe(PATH_RESOLVE)
  })
})
