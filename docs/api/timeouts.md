# OneBlink API CLI

## Timeouts

Each route will have a default of **15 seconds** to complete before it will automatically timeout. The timeout for all routes in the project can be set in `.blinkmrc.json`:

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
