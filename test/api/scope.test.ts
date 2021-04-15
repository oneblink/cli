import { BlinkMRC } from '../../src/api/types'

describe('scope', () => {
  const CWD = 'current working directory'
  const CFG = {
    server: {
      project: 'name of project',
      region: 'name of region',
    },
  }

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('read() should call projectMeta.read() with correct input', async () => {
    const mockRead = jest.fn()
    mockRead.mockImplementation(async () => CFG)
    jest.mock('api/utils/project-meta', () => ({
      read: mockRead,
    }))
    const { default: scope } = await import('../../src/api/scope')

    await scope.read(CWD)
    expect(mockRead).toBeCalledWith(CWD)
  })

  test('read() should handle an uninitialized config file', async () => {
    jest.mock('api/utils/project-meta', () => ({
      read: async () => null,
    }))
    const { default: scope } = await import('../../src/api/scope')

    const cfg = await scope.read(CWD)
    expect(cfg).toEqual({})
  })

  test('read() should return the currently set scope', async () => {
    jest.mock('api/utils/project-meta', () => ({
      read: async () => CFG,
    }))
    const { default: scope } = await import('../../src/api/scope')

    const cfg = await scope.read(CWD)
    expect(cfg).toEqual(CFG.server)
  })

  test('read() should reject if projectMeta.read() throws an error', async () => {
    jest.mock('api/utils/project-meta', () => ({
      read: async () => {
        throw new Error('error message')
      },
    }))
    const { default: scope } = await import('../../src/api/scope')

    const promise = scope.read(CWD)
    await expect(promise).rejects.toThrow('error message')
  })

  test('display() should call projectMeta.read() with correct input', async () => {
    const mockRead = jest.fn()
    mockRead.mockImplementation(async () => CFG)
    jest.mock('api/utils/project-meta', () => ({
      read: mockRead,
    }))
    const { default: scope } = await import('../../src/api/scope')

    await scope.display(console, CWD, 'dev')
    expect(mockRead).toBeCalledWith(CWD)
  })

  test('display() should reject with nice error message if projectMeta.read() throws an error', async () => {
    jest.mock('api/utils/project-meta', () => ({
      read: async () => {
        throw new Error('test error message')
      },
    }))
    const { default: scope } = await import('../../src/api/scope')

    const promise = scope.display(console, CWD, 'dev')
    await expect(promise).rejects.toThrow(
      'Scope has not been set yet, see --help for information on how to set scope.',
    )
  })

  test('display() should reject with nice error message if scope has not been set', async () => {
    jest.mock('api/utils/project-meta', () => ({
      read: async () => null,
    }))
    const { default: scope } = await import('../../src/api/scope')

    const promise = scope.display(console, CWD, 'dev')
    await expect(promise).rejects.toThrow(
      'Scope has not been set yet, see --help for information on how to set scope.',
    )
  })

  test('display() should log the currently set scope', async () => {
    jest.mock('api/utils/project-meta', () => ({
      read: async () => CFG,
    }))
    const spy = jest.spyOn(console, 'log')
    const { default: scope } = await import('../../src/api/scope')
    await scope.display(console, CWD, 'dev')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('write() should reject if project is not set on the meta object', async () => {
    jest.mock('api/utils/project-meta', () => ({
      write: async () => undefined,
    }))
    const { default: scope } = await import('../../src/api/scope')
    const promise = scope.write(CWD, {})
    await expect(promise).rejects.toThrow('meta.project was not defined.')
  })

  test('write() should merge new scope with the current config', async () => {
    const originalConfig = {
      bmp: {
        scope: 'blah',
      },
      server: {
        project: 'old',
      },
      extra: 'existing',
    }
    const newConfig = {
      project: 'new project',
      tenant: 'oneblink',
    }
    const mockWrite = jest.fn()
    mockWrite.mockImplementation(
      async (cwd: string, updater: (config: BlinkMRC) => BlinkMRC) =>
        updater(originalConfig),
    )
    jest.mock('api/utils/project-meta', () => ({
      write: mockWrite,
    }))
    const { default: scope } = await import('../../src/api/scope')

    const config = await scope.write(CWD, newConfig)
    expect(config).toEqual({
      project: 'new project',
    })
    expect(mockWrite.mock.calls[0][0]).toBe(CWD)
  })
})
