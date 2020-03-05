/* @flow */
'use strict'

const CREDENTIALS /* : boolean */ = false
const HEADERS /* : Array<string> */ = [
  'Accept',
  'Authorization',
  'Content-Type',
  'If-None-Match',
  'X-Amz-Date',
  'X-Amz-Security-Token',
  'X-Api-Key',
]
const EXPOSED_HEADERS /* : Array<string> */ = [
  'Server-Authorization',
  'WWW-Authenticate',
]
const MAX_AGE /* : number */ = 86400 // 1 Day
const ORIGINS /* : Array<string> */ = ['*']

const METHODS /* : Array<string> */ = [
  'DELETE',
  'GET',
  'OPTIONS',
  'PATCH',
  'POST',
  'PUT',
]

const DEFAULT_TIMEOUT_SECONDS /* : number */ = 15

const ANALYTICS_ORIGIN =
  process.env.ANALYTICS_ORIGIN || 'https://analytics.blinkm.io'

module.exports = {
  DEFAULT_CORS: {
    CREDENTIALS,
    EXPOSED_HEADERS,
    HEADERS,
    MAX_AGE,
    ORIGINS,
  },
  DEFAULT_TIMEOUT_SECONDS,
  METHODS,
  ANALYTICS_ORIGIN,
}
