import path from 'path'
import listDirectoryRoutes from '../../src/api/listDirectoryRoutes'
import values from '../../src/api/values'

test('listDirectoryRoutes()', () => {
  const EXAMPLE_DIR = path.join(
    __dirname,
    '..',
    '..',
    'examples',
    'api',
    'directory',
  )
  const expected = [
    {
      route: '/boom',
      module: './boom/index.js',
      timeout: values.DEFAULT_TIMEOUT_SECONDS,
    },
    {
      route: '/helloworld',
      module: './helloworld/index.js',
      timeout: values.DEFAULT_TIMEOUT_SECONDS,
    },
    {
      route: '/methods',
      module: './methods/index.js',
      timeout: values.DEFAULT_TIMEOUT_SECONDS,
    },
    {
      route: '/promise',
      module: './promise/index.js',
      timeout: values.DEFAULT_TIMEOUT_SECONDS,
    },
    {
      route: '/request',
      module: './request/index.js',
      timeout: values.DEFAULT_TIMEOUT_SECONDS,
    },
    {
      route: '/response',
      module: './response/index.js',
      timeout: values.DEFAULT_TIMEOUT_SECONDS,
    },
  ]
  return listDirectoryRoutes(EXAMPLE_DIR).then((results) =>
    expect(results).toEqual(expected),
  )
})
