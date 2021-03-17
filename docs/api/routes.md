# OneBlink API CLI

## Routes

Routes can be defined in two different ways to allow for ease of use or flexibility.

### Directory Defined

- See [directory example](../../examples/api/directory) for sample

- Quick to get started

- Must follow a strict directory structure. All files that match the following [glob](https://github.com/isaacs/node-glob) pattern will become handlers for functions:

  ```
  ./*/index.js
  ```

#### Project Structure

The following directory structure:

```
|-- project-root
|   |-- .blinkmrc.json
|   |-- hellogalaxy
|   |   |-- index.js
|   |-- helloworld
|   |   |-- index.js
|   |-- lib
|   |   |-- common-code-one.js
|   |   |-- common-code-two.js
```

Would create the following routes:

1.  `/hellogalaxy`

1.  `/helloworld`

#### Notes

- The files in the `lib` directory are ignored as they do not match the glob pattern.

### Configuration Defined

- See [configuration example](../../examples/api/configuration) for sample

- Allows for any number of sections in URL path

- Allows for replaceable parameters in URL path

- Allows for flexible project structure

#### .blinkmrc.json

The following route definitions:

```json
{
  "server": {
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

With the following directory structure:

```
|-- project-root
|   |-- .blinkmrc.json
|   |-- api
|   |   |-- hello.js
|   |   |-- helloworld.js
|   |-- lib
|   |   |-- common-code-one.js
|   |   |-- common-code-two.js
```

Would create the following routes:

1.  `/api/hello/{name}`

1.  `/api/helloworld`

#### Notes

- The `module` property must specify a relative path to the handler file. This file must be in the project.

- The `{name}` parameter will be available via `request.url.params.name` in the handler function(s) in `./api/hello.js`.
