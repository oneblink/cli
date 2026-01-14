import { afterEach, describe, expect, test, vi } from 'vitest'

describe('variables', () => {
  const CWD = 'current working directory'
  const blinkmrc = {
    server: {
      variables: {
        MY_VARIABLE_SCOPED: {
          test: 'test scoped value',
          prod: 'prod scoped value',
        },
        MY_VARIABLE: 'unscoped$value',
        MY_REFERENCED_VARIABLE: '${MY_REFERENCE}',
      },
    },
  }

  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  test('read() should handle an uninitialized config file', async () => {
    vi.doMock('../../src/api/utils/project-meta', () => ({
      default: {
        read: async () => undefined,
      },
    }))
    const { default: variables } = await import('../../src/api/variables.js')
    const envVars = await variables.read(CWD, 'dev')
    expect(envVars).toEqual({})
  })

  test('read() should return the correct values for the scoped variables', async () => {
    const referencedValue = 'referenced value'
    vi.doMock('../../src/api/utils/project-meta', () => ({
      default: {
        read: async () => blinkmrc,
      },
    }))
    const { default: variables } = await import('../../src/api/variables.js')
    process.env.MY_REFERENCE = referencedValue

    const devVars = await variables.read(CWD, 'dev')
    expect(devVars).toEqual({
      MY_VARIABLE_SCOPED: undefined,
      MY_VARIABLE: 'unscoped$value',
      MY_REFERENCED_VARIABLE: referencedValue,
    })

    const testVars = await variables.read(CWD, 'test')
    expect(testVars).toEqual({
      MY_VARIABLE_SCOPED: 'test scoped value',
      MY_VARIABLE: 'unscoped$value',
      MY_REFERENCED_VARIABLE: referencedValue,
    })

    const prodVars = await variables.read(CWD, 'prod')
    expect(prodVars).toEqual({
      MY_VARIABLE_SCOPED: 'prod scoped value',
      MY_VARIABLE: 'unscoped$value',
      MY_REFERENCED_VARIABLE: referencedValue,
    })
  })

  test('read() should reject if there is a variable with an unsupported type value', async () => {
    vi.doMock('../../src/api/utils/project-meta', () => ({
      default: {
        read: async () => ({
          server: {
            variables: {
              UNSUPPORTED_TYPE: 123,
            },
          },
        }),
      },
    }))
    const { default: variables } = await import('../../src/api/variables.js')

    const promise = variables.read(CWD, 'dev')
    await expect(promise).rejects.toThrow(
      'Variable UNSUPPORTED_TYPE must be an object or a string',
    )
  })

  test('read() should reject if there is a scoped variable with an unsupported type value', async () => {
    vi.doMock('../../src/api/utils/project-meta', () => ({
      default: {
        read: async () => ({
          server: {
            variables: {
              UNSUPPORTED_TYPE: {
                dev: true,
              },
            },
          },
        }),
      },
    }))
    const { default: variables } = await import('../../src/api/variables.js')

    const promise = variables.read(CWD, 'dev')
    await expect(promise).rejects.toThrow(
      'Variable UNSUPPORTED_TYPE for Environment dev must be a string',
    )
  })

  test('display() should not log anything if there are no variables to display', async () => {
    vi.doMock('../../src/api/utils/project-meta', () => ({
      default: {
        read: async () => undefined,
      },
    }))
    const spy = vi.spyOn(console, 'log')
    const { default: variables } = await import('../../src/api/variables.js')
    await variables.display(console, CWD, 'dev')
    expect(spy).not.toHaveBeenCalled()
  })

  test('display() should log once', async () => {
    vi.doMock('../../src/api/utils/project-meta', () => ({
      default: {
        read: async () => blinkmrc,
      },
    }))
    const spy = vi.spyOn(console, 'log')
    const { default: variables } = await import('../../src/api/variables.js')
    await variables.display(console, CWD, 'dev')
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
