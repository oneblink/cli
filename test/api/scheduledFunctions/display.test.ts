import { describe, expect, test, jest } from '@jest/globals'

describe('display', () => {
  const CWD = 'current working directory'
  const SCHEDULEDFUNCTIONS = [
    {
      name: 'scheduledFunction1',
      label: 'Scheduled Function 1',
      module: './api/function1.js',
    },
    {
      name: 'scheduledBooks',
      label: 'Scheduled Books',
      module: './api/scheduledBooks.js',
    },
    {
      name: 'scheduledHats',
      label: 'Scheduled Hats',
      module: './api/scheduledHats.js',
    },
  ]

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('Should call read() with correct input and log', async () => {
    const spy = jest.spyOn(console, 'log')
    const mockRead = jest.fn(async () => SCHEDULEDFUNCTIONS)
    jest.unstable_mockModule('api/scheduledFunctions/read', () => ({
      default: mockRead,
    }))
    jest.unstable_mockModule('api/scheduledFunctions/validate', () => ({
      default: async () => [],
    }))
    const { default: display } = await import(
      '../../../src/api/scheduledFunctions/display'
    )
    await display(console, CWD)
    expect(mockRead).toBeCalledWith(CWD)
    expect(spy).toBeCalled()
  })

  test('Should log the scheduledFunctions and reject if no scheduledFunctions are found', async () => {
    const spy = jest.spyOn(console, 'log')
    jest.unstable_mockModule('api/scheduledFunctions/read', () => ({
      default: async () => [],
    }))

    const { default: display } = await import(
      '../../../src/api/scheduledFunctions/display'
    )
    const promise = display(console, CWD)
    await expect(promise).rejects.toThrow(
      'No scheduled functions found, see documentation for information on how to create scheduled functions.',
    )
    expect(spy).not.toHaveBeenCalled()
  })

  test('Should call validate() for each scheduledFunctions returned from read()', async () => {
    const mockValidate = jest.fn(async () => [])
    jest.unstable_mockModule('api/scheduledFunctions/read', () => ({
      default: async () => SCHEDULEDFUNCTIONS,
    }))
    jest.unstable_mockModule('api/scheduledFunctions/validate', () => ({
      default: mockValidate,
    }))
    const { default: display } = await import(
      '../../../src/api/scheduledFunctions/display'
    )
    await display(console, CWD)
    expect(mockValidate).toBeCalledTimes(SCHEDULEDFUNCTIONS.length)
  })

  test('Should log the table and reject if errors are return from validate()', async () => {
    const spy = jest.spyOn(console, 'log')
    jest.unstable_mockModule('api/scheduledFunctions/read', () => ({
      default: async () => SCHEDULEDFUNCTIONS,
    }))
    jest.unstable_mockModule('api/scheduledFunctions/validate', () => ({
      default: async () => ['error1', 'error2'],
    }))

    const { default: display } = await import(
      '../../../src/api/scheduledFunctions/display'
    )
    const promise = display(console, CWD)
    await expect(promise).rejects.toThrow(
      '3 of 3 scheduled functions configurations are invalid.',
    )
    expect(spy).toHaveBeenCalled()
  })
})
