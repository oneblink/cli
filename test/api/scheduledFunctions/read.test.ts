import { describe, expect, test, jest } from '@jest/globals'
import { ScheduledFunctionConfiguration } from '../../../src/api/types.js'

describe('read', () => {
  const CWD = 'current working directory'

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('Should use configuration scheduled functions if available', async () => {
    const CONFIGURATION_SCHEDULED_FUNCTIONS: ScheduledFunctionConfiguration[] =
      []
    const mockScopeRead = jest.fn(async () => ({
      scheduledFunctions: CONFIGURATION_SCHEDULED_FUNCTIONS,
    }))
    jest.unstable_mockModule('api/scope', () => ({
      default: {
        read: mockScopeRead,
      },
    }))

    const { default: read } = await import(
      '../../../src/api/scheduledFunctions/read.js'
    )

    const scheduledFunctions = await read(CWD)
    expect(scheduledFunctions).toEqual(CONFIGURATION_SCHEDULED_FUNCTIONS)
    expect(mockScopeRead).toBeCalledWith(CWD)
  })

  test('Should not reject and should always return an array if no scheduled functions are found', async () => {
    jest.unstable_mockModule('api/scope', () => ({
      default: {
        read: async () => ({}),
      },
    }))
    const { default: read } = await import(
      '../../../src/api/scheduledFunctions/read.js'
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
      '../../../src/api/scheduledFunctions/read.js'
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
