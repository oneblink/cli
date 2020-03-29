'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')

const TEST_SUBJECT = '../../../lib/api/routes/read.js'

const CWD = 'current working directory'
const CONFIGURATION_ROUTES = [{ route: 'configuration routes' }]
const PROJECT_ROUTES = [{ route: 'project routes' }]

test.beforeEach((t) => {
  t.context.getTestSubject = (overrides) => {
    overrides = overrides || {}
    return proxyquire(
      TEST_SUBJECT,
      Object.assign(
        {
          '../scope.js': {
            read: () =>
              Promise.resolve({
                routes: CONFIGURATION_ROUTES,
              }),
          },

          '../project.js': {
            listRoutes: () => Promise.resolve(PROJECT_ROUTES),
          },
        },
        overrides,
      ),
    )
  }
})

test('Should use configuration routes if available', (t) => {
  t.plan(2)
  const read = t.context.getTestSubject({
    '../scope.js': {
      read: (cwd) => {
        t.is(cwd, CWD)
        return Promise.resolve({
          routes: CONFIGURATION_ROUTES,
        })
      },
    },
    '../project.js': {
      listRoutes: () => {
        t.fail('Should not be looking in project for routes')
        return Promise.resolve()
      },
    },
  })

  return read(CWD).then((routes) => t.deepEqual(routes, CONFIGURATION_ROUTES))
})

test('Should use project routes if configuration routes are unavailable', (t) => {
  t.plan(2)
  const read = t.context.getTestSubject({
    '../scope.js': {
      read: () => Promise.resolve({}),
    },
    '../project.js': {
      listRoutes: (cwd) => {
        t.is(cwd, CWD)
        return Promise.resolve(PROJECT_ROUTES)
      },
    },
  })

  return read(CWD).then((routes) => t.deepEqual(routes, PROJECT_ROUTES))
})

test('Should not reject and should always return an array if no routes are found', (t) => {
  t.plan(1)
  const read = t.context.getTestSubject({
    '../scope.js': {
      read: () => Promise.resolve({}),
    },
    '../project.js': {
      listRoutes: () => Promise.resolve(null),
    },
  })

  return read(CWD).then((routes) => t.deepEqual(routes, []))
})

test('Timeouts should be set via priority default, project, route', (t) => {
  const read = t.context.getTestSubject({
    '../scope.js': {
      read: () =>
        Promise.resolve({
          timeout: 20,
          routes: [
            {
              route: 'config timeout',
            },
            {
              route: 'route timeout',
              timeout: 25,
            },
          ],
        }),
    },
  })

  return read(CWD).then((routes) =>
    t.deepEqual(routes, [
      {
        route: 'config timeout',
        timeout: 20,
      },
      {
        route: 'route timeout',
        timeout: 25,
      },
    ]),
  )
})
