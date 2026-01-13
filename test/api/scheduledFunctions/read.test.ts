import { afterEach, describe, expect, test, vi } from 'vitest'
import { ScheduledFunctionConfiguration } from '../../../src/api/types.js'

describe('read', () => {
  const CWD = 'current working directory'

  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  test('Should use configuration scheduled functions if available', async () => {
    const CONFIGURATION_SCHEDULED_FUNCTIONS: ScheduledFunctionConfiguration[] =
      []
    const mockScopeRead = vi.fn(async () => ({
      scheduledFunctions: CONFIGURATION_SCHEDULED_FUNCTIONS,
    }))
    vi.doMock('../../../src/api/scope', () => ({
      default: {
        read: mockScopeRead,
      },
    }))

    const { default: read } =
      await import('../../../src/api/scheduledFunctions/read.js')

    const scheduledFunctions = await read(CWD)
    expect(scheduledFunctions).toEqual(CONFIGURATION_SCHEDULED_FUNCTIONS)
    expect(mockScopeRead).toBeCalledWith(CWD)
  })

  test('Should not reject and should always return an array if no scheduled functions are found', async () => {
    vi.doMock('../../../src/api/scope', () => ({
      default: {
        read: async () => ({}),
      },
    }))
    const { default: read } =
      await import('../../../src/api/scheduledFunctions/read.js')

    const scheduledFunctions = await read(CWD)
    expect(scheduledFunctions).toEqual([])
  })

  test('Timeouts should be set via priority default, project, scheduledFunction', async () => {
    vi.doMock('../../../src/api/scope', () => ({
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
    const { default: read } =
      await import('../../../src/api/scheduledFunctions/read.js')

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
