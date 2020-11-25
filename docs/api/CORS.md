# OneBlink API CLI

## CORS Configuration

[Cross-Origin Resource Sharing](https://www.w3.org/TR/cors/) protocol allows browsers to make cross-origin API calls.
CORS is required by web applications running inside a browser which are loaded from a different domain than the API server.

CORS can be configured in a `.blinkmrc.json` file that is in the root of your project directory e.g.

### Directory Structure

```
|-- project-root
|   |-- .blinkmrc.json
|   |-- helloworld
|   |   |-- index.js
```

### .blinkmrc.json

By setting `cors` to `false`, Cross-Origin resource sharing will not be allowed. **This is the default behaviour**

```json
{
  "server": {
    "cors": false
  }
}
```

Cross-Origin resource sharing can also be configured as below:

- origins: https://www.w3.org/TR/cors/#access-control-allow-origin-response-header
- headers: https://www.w3.org/TR/cors/#access-control-allow-headers-response-header
- exposedHeaders: https://www.w3.org/TR/cors/#access-control-expose-headers-response-header
- credentails: https://www.w3.org/TR/cors/#access-control-allow-credentials-response-header
- maxAge: https://www.w3.org/TR/cors/#access-control-max-age-response-header

### Example

**Note:** If any properties are omitted, they will default to:

```json
{
  "server": {
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
    }
  }
}
```

Alternatively `cors` can be set to `true` to use the defaults above.

```json
{
  "server": {
    "cors": true
  }
}
```
