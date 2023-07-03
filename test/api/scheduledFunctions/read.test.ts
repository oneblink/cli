import { describe, expect, test, jest } from '@jest/globals'

describe('read', () => {
  const CWD = 'current working directory'
  const CONFIGURATION_SCHEDULED_FUNCTIONS = [
    { schduledFunctions: 'configuration routes' },
  ]

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('Should use configuration scheduled functions if available', async () => {
    const mockScopeRead = jest.fn(async () => ({
      scheduledFunctions: CONFIGURATION_SCHEDULED_FUNCTIONS,
    }))
    jest.unstable_mockModule('api/scope', () => ({
      default: {
        read: mockScopeRead,
      },
    }))

    const { default: read } = await import(
      '../../../src/api/scheduledFunctions/read'
    )

    const scheduledFunctions = await read(CWD)
    expect(scheduledFunctions).toEqual(CONFIGURATION_SCHEDULED_FUNCTIONS)
    expect(mockScopeRead).toBeCalledWith(CWD)
  })

  test('Should not reject and should always return an array if no scheduled functions are found', async () => {
    jest.unstable_mockModule('api/scope', () => ({
      default: {
        read: async () => ({
          scheduledFunctions: [],
        }),
      },
    }))
    const { default: read } = await import(
      '../../../src/api/scheduledFunctions/read'
    )

    const scheduledFunctions = await read(CWD)
    expect(scheduledFunctions).toEqual([])
  })

  test('Timeouts should be set via priority default, project, scheduledFunction', async () => {
    jest.unstable_mockModule('api/scope', () => ({
      default: {
        read: async () => ({
          timeout: 20,
          scheduledFunctions: [
            {
              label: 'config timeout',
            },
            {
              label: 'route timeout',
              timeout: 25,
            },
          ],
        }),
      },
    }))
    const { default: read } = await import(
      '../../../src/api/scheduledFunctions/read'
    )

    const scheduledFunctions = await read(CWD)
    expect(scheduledFunctions).toEqual([
      {
        label: 'config timeout',
        timeout: 20,
      },
      {
        label: 'route timeout',
        timeout: 25,
      },
    ])
  })
})
