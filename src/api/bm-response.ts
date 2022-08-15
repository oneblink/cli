import { OneBlinkAPIHostingResponse } from '../../index.js'

class BmResponseImplementation<T> implements OneBlinkAPIHostingResponse<T> {
  private _headers: OneBlinkAPIHostingResponse<T>['headers']
  private _payload: T
  private _statusCode: OneBlinkAPIHostingResponse<T>['statusCode']

  constructor() {
    this._headers = {}
    this._statusCode = 200
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._payload = undefined as any
  }

  get headers(): OneBlinkAPIHostingResponse<T>['headers'] {
    return Object.assign({}, this._headers)
  }

  get payload(): T {
    return this._payload
  }

  get statusCode(): OneBlinkAPIHostingResponse<T>['statusCode'] {
    return this._statusCode
  }

  setHeader(key: string, value: string): OneBlinkAPIHostingResponse<T> {
    this._headers[key.toLowerCase()] = value
    return this
  }

  setPayload(payload: T): OneBlinkAPIHostingResponse<T> {
    this._payload = payload
    return this
  }

  setStatusCode(
    code: OneBlinkAPIHostingResponse<T>['statusCode'],
  ): OneBlinkAPIHostingResponse<T> {
    this._statusCode = code
    return this
  }
}

export default BmResponseImplementation
