import path from 'path'

import pkg from '../../../src/package'

describe('project-meta', () => {
  const CWD = path.join(__dirname, '..', 'fixtures', 'project-meta')

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('read() should return contents of .blinkmrc.json file', async () => {
    const { default: projectMeta } = await import(
      '../../../src/api/utils/project-meta'
    )

    console.log('CWD', CWD)
    const meta = await projectMeta.read(CWD)
    expect(meta).toEqual({
      'project-meta': 'test',
    })
  })

  test('projectConfig() call configLoader with correct input', async () => {
    const mockProjectConfig = jest.fn()
    jest.mock('@blinkmobile/blinkmrc', () => ({
      projectConfig: mockProjectConfig,
    }))
    const { default: projectMeta } = await import(
      '../../../src/api/utils/project-meta'
    )

    await projectMeta.projectConfig(CWD)
    expect(mockProjectConfig).toBeCalledWith({
      name: pkg.name,
      cwd: CWD,
    })
  })

  test('read() should return empty object if load() rejects', async () => {
    jest.mock('@blinkmobile/blinkmrc', () => ({
      projectConfig: () => ({
        load: async () => {
          throw new Error()
        },
      }),
    }))
    const { default: projectMeta } = await import(
      '../../../src/api/utils/project-meta'
    )

    const meta = await projectMeta.read(CWD)
    expect(meta).toEqual({})
  })

  test('write() should call the updater function passed', async () => {
    jest.mock('@blinkmobile/blinkmrc', () => ({
      projectConfig: () => ({
        update: async (updater: () => void) => {
          updater()
        },
      }),
    }))

    const { default: projectMeta } = await import(
      '../../../src/api/utils/project-meta'
    )
    const mockUpdate = jest.fn()
    await projectMeta.write(CWD, mockUpdate)
    expect(mockUpdate).toBeCalled()
  })
})
