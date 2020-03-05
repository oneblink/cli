/* @flow */
'use strict'

/* ::
import type {RouteConfiguration} from './types.js'
*/

const glob = require('glob')
const pify = require('pify')

const values = require('./values.js')

function listAPIs(cwd /* : string */) /* : Promise<Array<string>> */ {
  return pify(glob)('./*/index.js', { cwd }).then(matches =>
    matches.map(match => match.split('/')[1]),
  )
}

function listRoutes(
  cwd /* : string */,
) /* : Promise<Array<RouteConfiguration>> */ {
  return listAPIs(cwd).then(apis =>
    apis.map(api => ({
      route: `/${api}`,
      module: `./${api}/index.js`,
      timeout: values.DEFAULT_TIMEOUT_SECONDS,
    })),
  )
}

module.exports = {
  listAPIs,
  listRoutes,
}
