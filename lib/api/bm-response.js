/* @flow */
'use strict'

const createInternal = require('./utils/internal.js').createInternal

/* ::
import type {Headers} from './types.js'
*/

const internal = createInternal()

class BmResponse {
  constructor() {
    Object.assign(internal(this), {
      headers: {},
      payload: undefined,
      statusCode: 200,
    })
  }

  get headers() /* : Headers */ {
    return Object.assign({}, internal(this).headers)
  }

  get payload() /* : any */ {
    return internal(this).payload
  }

  get statusCode() /* : number */ {
    return internal(this).statusCode
  }

  setHeader(key /* : string */, value /* : string */) /* : BmResponse */ {
    key = key.toLowerCase()
    internal(this).headers[key] = value
    return this
  }

  setPayload(payload /* : any */) /* : BmResponse */ {
    internal(this).payload = payload
    return this
  }

  setStatusCode(code /* : number */) /* : BmResponse */ {
    internal(this).statusCode = code
    return this
  }
}

module.exports = BmResponse
