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

The following configuration will allow `process.env.MY_VARIABLE` and `process.env.MY_VARIABLE_SCOPED` to be available in code:

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

The value of `process.env.MY_VARIABLE_SCOPED` will depend on the value of `--env` flag used during deployment

```sh
oneblink api deploy --env dev
```

```js
module.exports = function handler() {
  if (process.env.MY_VARIABLE_SCOPED === 'dev scoped value') {
    // It works! :)
  }
}
```

#### Notes

- If an environment does not exist, a _scoped_ variable will not be set at all

### Referencing Environment Variables

To reference environment variables, use the `${MY_VARIABLE}` syntax in your `.blinkmrc.json` configuration file.

#### .blinkmrc.json

The following configuration will set `process.env.MY_VARIABLE` at runtime to the value of `MY_EXISTING_VARIABLE` during the deploy process:

```json
{
  "server": {
    "variables": {
      "MY_VARIABLE": "${MY_EXISTING_VARIABLE}"
    }
  }
}
```

```sh
export MY_EXISTING_VARIABLE="value"
oneblink api deploy
```

```js
module.exports = function handler() {
  if (process.env.MY_VARIABLE === 'value') {
    // It works! :)
  }
}
```

#### Notes

- If the reference variable does not exist, the variable at runtime will not be set at all
