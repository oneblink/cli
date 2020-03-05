/* @flow */
'use strict'

/* ::
import type {CorsConfiguration} from '../types.js'
*/

const projectMeta = require('../utils/project-meta.js')
const values = require('../values.js')

function readCors(
  cwd /* : string */,
) /* : Promise<CorsConfiguration | false> */ {
  return projectMeta.read(cwd).then(config => {
    // Want to support two options here:
    // 1. Falsey to disable CORS
    if (!config.server || !config.server.cors) {
      return false
    }
    // 2. Truthy to use default CORS and merge in any custom stuff
    return Object.assign(
      {
        credentials: values.DEFAULT_CORS.CREDENTIALS,
        exposedHeaders: values.DEFAULT_CORS.EXPOSED_HEADERS,
        headers: values.DEFAULT_CORS.HEADERS,
        maxAge: values.DEFAULT_CORS.MAX_AGE,
        origins: values.DEFAULT_CORS.ORIGINS,
      },
      typeof config.server.cors === 'boolean' ? {} : config.server.cors,
    )
  })
}

module.exports = readCors
