describe('s3-bucket-params', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('it should return the stored params', async () => {
    const config = {
      cdn: {
        scope: 'a',
        objectParams: {
          Expires: 60,
          ACL: 'public-read',
        },
      },
    }
    const expectedConfig = {
      scope: 'a',
      objectParams: {
        Expires: 60,
        ACL: 'public-read',
      },
      service: {},
    }

    jest.mock('cdn/utils/config-helper', () => ({
      read: () => Promise.resolve(config),
      write: () => new Error('should not be executed'),
    }))

    const { default: read } = await import('../../src/cdn/read')
    const s = await read('')
    expect(s).toEqual(expectedConfig)
  })

  test('it should return the default params and call write()', async () => {
    const expected = {
      scope: 'a',
      service: {},
    }

    jest.mock('cdn/utils/config-helper', () => ({
      read: () =>
        Promise.resolve({
          cdn: {
            scope: 'a',
          },
        }),
      write: () =>
        Promise.resolve({
          cdn: {
            scope: 'a',
            objectParams: {
              Expires: 60,
              ACL: 'public-read',
            },
          },
        }),
    }))

    const { default: read } = await import('../../src/cdn/read')
    const s = await read('')
    expect(s).toEqual(expected)
  })
})
