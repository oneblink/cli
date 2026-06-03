import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import path from 'path'
import fs from 'fs/promises'
import validate from '../../../src/api/routes/validate.js'

describe('validate', () => {
  const CWD = 'current working directory'
  const PATH_RESOLVE = 'returned from path resolve'
  const MODULE = 'module path'

  beforeEach(() => {
    vi.spyOn(path, 'resolve').mockReturnValue(PATH_RESOLVE as `${string}`)
    vi.spyOn(fs, 'stat').mockResolvedValue({} as Awaited<
      ReturnType<typeof fs.stat>
    >)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('Should contain error if route does not start with "/"', async () => {
    const errors = await validate(CWD, {
      route: 'test',
      module: 'test',
    })
    expect(errors).toEqual(['Route must start with a "/"'])
  })

  test('Should contain error if timeout is invalid', async () => {
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
    vi.mocked(fs.stat).mockRejectedValue(new Error(errorMessage))

    const result = await validate(CWD, {
      route: '/test',
      module: 'test',
    })
    expect(result).toEqual([errorMessage])
  })

  test('Should contain different error message if module can not be found with ENOENT code', async () => {
    const error = new Error('This is an error') as NodeJS.ErrnoException
    error.code = 'ENOENT'
    vi.mocked(fs.stat).mockRejectedValue(error)

    const errors = await validate(CWD, {
      route: '/test',
      module: MODULE,
    })
    expect(errors).toEqual([`Could not find module: ${MODULE}`])
  })

  test('Input for for fs.stat() should be the result of path.resolve()', async () => {
    const mockResolve = vi.mocked(path.resolve)
    const mockStat = vi.mocked(fs.stat)

    await validate(CWD, {
      route: '/test',
      module: MODULE,
    })

    expect(mockResolve).toBeCalledWith(CWD, MODULE)
    expect(mockStat.mock.calls[0][0]).toBe(PATH_RESOLVE)
  })
})
