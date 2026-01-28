import { afterEach, describe, expect, test, vi } from 'vitest'
import path from 'path'
import url from 'url'
import { BlinkMRC } from '../../../src/api/types.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

describe('project-meta', () => {
  const CWD = path.join(__dirname, '..', 'fixtures', 'project-meta')

  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  test('read() should return contents of .blinkmrc.json file', async () => {
    const { default: projectMeta } =
      await import('../../../src/api/utils/project-meta.js')

    const meta = await projectMeta.read(CWD)
    expect(meta).toEqual({
      'project-meta': 'test',
    })
  })

  test('projectConfig() call configLoader with correct input', async () => {
    const mockProjectConfig = vi.fn()
    vi.doMock('../../../src/blinkmrc.js', () => ({
      projectConfig: mockProjectConfig,
    }))
    const { default: projectMeta } =
      await import('../../../src/api/utils/project-meta.js')

    projectMeta.projectConfig(CWD)
    expect(mockProjectConfig).toBeCalledWith({
      cwd: CWD,
      ENOENTResult: {},
    })
  })

  test('write() should call the updater function passed', async () => {
    vi.doMock('../../../src/blinkmrc.js', () => ({
      projectConfig: () => ({
        update: async (updater: () => void) => {
          updater()
        },
      }),
    }))

    const { default: projectMeta } =
      await import('../../../src/api/utils/project-meta.js')
    const mockUpdate = vi.fn()
    await projectMeta.write(CWD, mockUpdate as (config: BlinkMRC) => BlinkMRC)
    expect(mockUpdate).toBeCalled()
  })
})
