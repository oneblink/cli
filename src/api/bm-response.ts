import createInternal from './utils/internal'

import type { Headers } from './types'
import { APITypes } from '@oneblink/types'

const internal = createInternal()

class BmResponseImplementation<T>
  implements APITypes.OneBlinkAPIHostingResponse<T> {
  constructor() {
    Object.assign(internal(this), {
      headers: {},
      payload: undefined,
      statusCode: 200,
    })
  }

  get headers(): Headers {
    return Object.assign({}, internal(this).headers)
  }

  get payload(): any {
    return internal(this).payload
  }

  get statusCode(): number {
    return internal(this).statusCode
  }

  setHeader(
    key: string,
    value: string,
  ): APITypes.OneBlinkAPIHostingResponse<T> {
    key = key.toLowerCase()
    internal(this).headers[key] = value
    return this
  }

  setPayload(payload: any): APITypes.OneBlinkAPIHostingResponse<T> {
    internal(this).payload = payload
    return this
  }

  setStatusCode(code: number): APITypes.OneBlinkAPIHostingResponse<T> {
    internal(this).statusCode = code
    return this
  }
}

export default BmResponseImplementation
