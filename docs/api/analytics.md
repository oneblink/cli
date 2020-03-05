# OneBlink API CLI

## Analytics

OneBlink Analytics integrates seamlessly with the OneBlink API CLI. Analytics collection can be configured in the `.blinkmrc.json` file that is in the root of your project directory e.g.

### Directory Structure

```
|-- project-root
|   |-- .blinkmrc.json
|   |-- helloworld
|   |   |-- index.js
```

### .blinkmrc.json

```json
{
  "server": {
    "analytics": {
      "key": "ABCDEFGHIJKL123456789012",
      "secret": "123456789012ABCDEFGHIJKL123456789012ABCDEFGHIJKL"
    }
  }
}
```

Your `key` and `secret` can be obtained from [OneBlink Analytics](https://analytics.oneblink.io) in the Analytics Keys section.

Once your API has been deployed, the following event structure will be collected each time one of your [routes](./routes.md) is used.

```json
{
  "request": {
    "method": "GET",
    "port": 443,
    "path": "/hello/world?search=abc",
    "hostName": "customer-project-environment.api.oneblink.io",
    "params": {
      "name": "world"
    },
    "protocol": "https:",
    "query": {
      "search": "abc"
    }
  },
  "response": {
    "statusCode": 200
  },
  "requestTime": {
    "startDateTime": "2019-03-11T23:43:40.300Z",
    "startTimeStamp": 1552347820300,
    "endDateTime": "2019-03-11T23:43:40.800Z",
    "endTimeStamp": 1552347820800,
    "ms": 500,
    "s": 0.5
  },
  "env": "environment",
  "scope": "customer-project.api.oneblink.io"
}
```
