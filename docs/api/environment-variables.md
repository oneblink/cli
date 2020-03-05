# OneBlink API CLI

## Environment Variables

Environment variables help define values which you may not want hard-coded in your source. They allow you to customize code behavior depending on the environment in which it is running.

Variables are stored inside `.blinkmrc.json` and these key/value pairs will be available to your code via `process.env`.

### Scoped vs Unscoped

We allow for variables to be scoped to a specific environment:

- _Unscoped_ variables are static values that do not change between environments. E.g. `process.env.COMPANY_NAME` may not change between environments

- _Scoped_ variables allow for the value of the variable to change based on the environment the function(s) are deployed to. E.g. `process.env.DATABASE_CONNECTION_STRING` may be different on `dev`, `test` and `prod` as each environment may have its own database as well.

#### .blinkmrc.json

- _Unscoped_ variables are declared using a `string` notation

- _Scoped_ variables are declared using an `object` notation

The following configuration will allow `process.env.MY_VARIABLE` and `process.env.MY_VARIABLE_SCOPED` to available in code:

```json
{
  "server": {
    "variables": {
      "MY_VARIABLE": "unscoped value",
      "MY_VARIABLE_SCOPED": {
        "dev": "dev scoped value",
        "test": "test scoped value",
        "prod": "prod scoped value"
      }
    }
  }
}
```

The value of `process.env.MY_VARIABLE_SCOPED` will depend on the value of `--env` flag used during `oneblink api deploy`

#### Notes

- If an environment does not exist, a _scoped_ variable will not be set at all
