# OneBlink API CLI

## Timeouts

Routes have a default of `15` seconds to complete before they automatically timeout. The timeout value can be set in `.blinkmrc.json` (timeout is **not** configurable per route):

```json
{
  "server": {
    "timeout": 10,
    "routes": [
      {
        "route": "/api/hello/{name}",
        "module": "./api/hello.js"
      },
      {
        "route": "/api/helloworld",
        "module": "./api/helloworld.js"
      }
    ]
  }
}
```

The example above, would result in the following timeouts for each route:

| Route             | Module              | Timeout (seconds) |
| ----------------- | ------------------- | ----------------- |
| /api/hello/{name} | ./api/hello.js      | 10                |
| /api/helloworld   | ./api/helloworld.js | 10                |

## Maximum

The maximum timeout for HTTP requests to Hosted APIs is `25` seconds. However, if you are using a route for a **Webhook: Hosted API** submission event, you are able to leverage a greater timeout value of `900` seconds.
