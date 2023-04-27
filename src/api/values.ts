const CREDENTIALS = false
const HEADERS: Array<string> = [
  'Accept',
  'Authorization',
  'Content-Type',
  'If-None-Match',
  'X-Amz-Date',
  'X-Amz-Security-Token',
  'X-Api-Key',
  'X-OneBlink-User-Token',
]
const EXPOSED_HEADERS: Array<string> = [
  'Server-Authorization',
  'WWW-Authenticate',
]
const MAX_AGE = 86400 // 1 Day
const ORIGINS: Array<string> = ['*']

const METHODS: Array<string> = [
  'DELETE',
  'GET',
  'OPTIONS',
  'PATCH',
  'POST',
  'PUT',
]

const DEFAULT_TIMEOUT_SECONDS = 15

export default {
  AWS_LAMBDA_RUNTIME: 'nodejs18.x',
  DEFAULT_CORS: {
    CREDENTIALS,
    EXPOSED_HEADERS,
    HEADERS,
    MAX_AGE,
    ORIGINS,
  },
  DEFAULT_TIMEOUT_SECONDS,
  METHODS,
}
