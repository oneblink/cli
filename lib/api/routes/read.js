/* @flow */
'use strict'

/* ::
import type {RouteConfiguration} from '../types.js'
*/

const scope = require('../scope.js')
const project = require('../project.js')
const values = require('../values.js')

function readRoutes(
  cwd /* : string */,
) /* : Promise<Array<RouteConfiguration>> */ {
  return scope.read(cwd).then(config => {
    return Promise.resolve()
      .then(() => config.routes || project.listRoutes(cwd))
      .then(routes => routes || [])
      .then(routes =>
        routes.map(route => {
          route.timeout =
            route.timeout || config.timeout || values.DEFAULT_TIMEOUT_SECONDS
          return route
        }),
      )
  })
}

module.exports = readRoutes
