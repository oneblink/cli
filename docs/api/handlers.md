# OneBlink API CLI

## Handlers

Handlers are the files that hold the function(s) that are executed for HTTP requests.

### Exports

A handler file can export either a single function or an object with [HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) for properties.

#### Function

Will be executed for all HTTP request methods

```js
module.exports = function (request, response) {
  // Will be executed for all HTTP request methods
}
```

#### Object

Must have properties containing functions for each supported HTTP request method

```js
module.exports.get = function (request, response) {
  // Will only be executed for GET HTTP method requests
}

module.exports.post = function (request, response) {
  // Will only be executed for POST HTTP method requests
}

module.exports.put = function (request, response) {
  // Will only be executed for PUT HTTP method requests
}

module.exports.delete = function (request, response) {
  // Will only be executed for DELETE HTTP method requests
}
```

##### Notes

- Object properties must be in lowercase

- HTTP request methods that are not implemented will return a `405 Method Not Allowed` e.g. A `PATCH` request to the handler above will return a `405`

### Function Arguments

The handler function(s) will always have the `request` and `response` arguments passed to them when executed.

#### Request

- The `request` argument is readonly and will contain pertinent data from a HTTP request.

```js
interface request = {
  body: any,
  headers: {
    [id:string]: string
  },
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
  url: {
    host: string,
    hostname: string,
    params: {
      [id:string]: string
    },
    pathname: string,
    protocol: 'http:' | 'https:',
    query: {
      [id:string]: string
    }
  }
}
```

##### Example

```js
module.exports = function (request, response) {
  return request
}
```

The handler above would return the following `json` object when executing the curl command below into from a terminal

```
curl "http://localhost:3000/request?key=123"
```

```json
{
  "body": null,
  "headers": {
    "host": "localhost:3000",
    "user-agent": "curl/7.49.1",
    "accept": "*/*"
  },
  "method": "get",
  "route": "/request/{id}",
  "url": {
    "protocol": "http:",
    "host": "localhost:3000",
    "hostname": "localhost",
    "query": {
      "key": "123"
    },
    "pathname": "/request/abc",
    "params": {
      "id": "abc"
    }
  }
}
```

#### Response

- The `response` argument will allow handler functions to control HTTP status codes, payloads and response headers.

- See [response example](../../examples/api/directory/response/index.js) for usage

```js
interface Response = {
  headers: {
    [id:string]: string
  },
  payload: any,
  statusCode: number,
  setHeader: (key: string, value: string) => Response,
  setPayload: (payload: any) => Response,
  setStatusCode: (code: number) => Response
}
```
