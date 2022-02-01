export type OneBlinkAPIHostingRequest<T = void> = {
  body: T
  headers: Record<string, string | boolean>
  method: string
  route: string
  url: {
    host: string
    hostname: string
    params: { [id: string]: string }
    pathname: string
    protocol: 'http:' | 'https:'
    query: Record<string, string | string[]>
    querystring: string
  }
}

export interface OneBlinkAPIHostingResponse<T = void> {
  readonly headers: OneBlinkAPIHostingRequest['headers']
  readonly payload: T
  readonly statusCode: number
  setHeader(key: string, value: string): OneBlinkAPIHostingResponse<T>
  setPayload(payload: T): OneBlinkAPIHostingResponse<T>
  setStatusCode(code: number): OneBlinkAPIHostingResponse<T>
}

export type OneBlinkAPIHostingHandlerResult<T> =
  | OneBlinkAPIHostingResponse<T>
  | T
  | number
  | void

export type OneBlinkAPIHostingHandler<In = void, Out = void> = (
  req: OneBlinkAPIHostingRequest<In>,
  res: OneBlinkAPIHostingResponse<Out>,
) =>
  | Promise<OneBlinkAPIHostingHandlerResult<Out>>
  | OneBlinkAPIHostingHandlerResult<Out>
