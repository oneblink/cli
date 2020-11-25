# OneBlink API CLI

## `.blinkmrc.json`

Below are all the properties that are supported in `.blinkmrc.json` file for the API Hosting `server` configuration. See the [API CLI Documentation](./README.md) for more information on each property.

```js
{
  "server": {
    // Define the entry point module for a route
    "routes": [
      {
        "route": "/api/hello/{name}",
        "module": "./api/hello.js"
      },
      {
        "route": "/api/helloworld",
        "module": "./api/helloworld.js"
      }
    ],
    // Timeout of all routes in seconds, defaults to 15 seconds.
    "timeout": 10,
    // Memory allocation in MB, defaults to 1024 MB.
    "memorySize": 2048,
    // "cors" can also be set to true (which is equivalent to the example below) or false (which will disable CORS), the default is false.
    "cors": {
      "origins": ["*"],
      "headers": [
        "Accept",
        "Authorization",
        "Content-Type",
        "If-None-Match",
        "X-Amz-Date",
        "X-Amz-Security-Token",
        "X-Api-Key",
        "X-OneBlink-User-Token"
      ],
      "exposedHeaders": ["Server-Authorization", "WWW-Authenticate"],
      "credentials": false,
      "maxAge": 86400 // in seconds = 1 day
    },
    // Environment variables that can be applied to all environments or scoped to a single environment
    "variables": {
      "MY_VARIABLE": "un-scoped value that applies to all environments",
      "MY_VARIABLE_SCOPED": {
        "dev": "scoped value that applies to only the 'dev' environment",
        "test": "scoped value that applies to only the 'test' environment",
        "prod": "scoped value that applies to only the 'prod' environment"
      }
    },
    // Optionally provide the name of an AWS profile to allow local development to reflect the deployed environment.
    "awsProfile": "name-of-profile"
  }
}
```
