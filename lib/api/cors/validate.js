/* @flow */
'use strict'

/* ::
import type {CorsConfiguration} from '../types.js'
*/

const validUrl = require('valid-url')

const HELP = ', see documentation for information on how to configure cors.'

function validateCors(
  cors /* : CorsConfiguration */,
) /* : Promise<CorsConfiguration> */ {
  if (!cors) {
    return Promise.reject(new Error('Must specify cors configuration' + HELP))
  }
  // Origins
  if (!cors.origins || !Array.isArray(cors.origins) || !cors.origins.length) {
    return Promise.reject(
      new Error(
        'Must specify at least a single allowable origin in cors configuration' +
          HELP,
      ),
    )
  }
  const invalidOrigins = cors.origins.reduce((invalidOrigins, origin) => {
    if (origin !== '*' && !validUrl.isWebUri(origin)) {
      invalidOrigins.push(origin)
    }
    return invalidOrigins
  }, [])
  if (invalidOrigins.length) {
    return Promise.reject(
      new Error(
        'The following origins in cors configuration are not valid: ' +
          invalidOrigins.join(', '),
      ),
    )
  }
  // Headers
  if (cors.headers && !Array.isArray(cors.headers)) {
    return Promise.reject(
      new Error(
        'Headers must be an array of strings in cors configuration' + HELP,
      ),
    )
  }
  // Exposed Headers
  if (cors.exposedHeaders && !Array.isArray(cors.exposedHeaders)) {
    return Promise.reject(
      new Error(
        'Exposed headers must be an array of strings in cors configuration' +
          HELP,
      ),
    )
  }
  // Max Age
  if (!Number.isFinite(cors.maxAge)) {
    return Promise.reject(
      new Error('Max age must be a number in cors configuration' + HELP),
    )
  }
  // Credentials
  if (typeof cors.credentials !== 'boolean') {
    return Promise.reject(
      new Error('Credentials must be a boolean in cors configuration' + HELP),
    )
  }
  return Promise.resolve(cors)
}

module.exports = validateCors
