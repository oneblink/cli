import { APITypes } from '@oneblink/types'

class BmResponseImplementation<T>
  implements APITypes.OneBlinkAPIHostingResponse<T> {
  private _headers: APITypes.OneBlinkAPIHostingResponse<T>['headers']
  private _payload: T
  private _statusCode: APITypes.OneBlinkAPIHostingResponse<T>['statusCode']

  constructor() {
    this._headers = {}
    this._statusCode = 200
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._payload = undefined as any
  }

  get headers(): APITypes.OneBlinkAPIHostingResponse<T>['headers'] {
    return Object.assign({}, this._headers)
  }

  get payload(): T {
    return this._payload
  }

  get statusCode(): APITypes.OneBlinkAPIHostingResponse<T>['statusCode'] {
    return this._statusCode
  }

  setHeader(
    key: string,
    value: string,
  ): APITypes.OneBlinkAPIHostingResponse<T> {
    this._headers[key.toLowerCase()] = value
    return this
  }

  setPayload(payload: T): APITypes.OneBlinkAPIHostingResponse<T> {
    this._payload = payload
    return this
  }

  setStatusCode(
    code: APITypes.OneBlinkAPIHostingResponse<T>['statusCode'],
  ): APITypes.OneBlinkAPIHostingResponse<T> {
    this._statusCode = code
    return this
  }
}

export default BmResponseImplementation
