# OneBlink API CLI

## Web Application Firewall (WAF) Configuration

WAF configuration will allow your [handlers](./handlers.md) to run in behind a WAF based on the environment.

#### .blinkmrc.json

WAF configuration is scoped to a specific environment. If an environment is not specified in the `.blinkmrc.json` file, it will be defaulted depending on your other existing environments (if all enabled, then true, otherwise false).

```json
{
  "server": {
    "waf": {
      "dev": true,
      "prod": false
    }
  }
}
```

The configuration used will depend on the value of `--env` flag used during `oneblink api deploy`
