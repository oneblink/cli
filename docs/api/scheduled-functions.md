# OneBlink API CLI

## Scheduled Functions

Scheduled functions allow developers to run a function periodically. The function will be executed without any arguments. The schedule the functions run on will determined by a team member in the Console after the function has been deployed. Functions are defined in your `.blinkmrc.json` file similar to routes.

### .blinkmrc.json

The following scheduled function definitions:

```json
{
  "server": {
    "scheduledFunctions": [
      {
        "label": "Hello World",
        "name": "world",
        "module": "./src/hello.js",
        "export": "sayHelloWorld",
        "timeout": 10
      },
      {
        "label": "Hello Galaxy",
        "name": "galaxy",
        "module": "./src/hello.js",
        "export": "sayHelloGalaxy",
        "timeout": 5
      }
    ]
  }
}
```

With the following directory structure:

```
|-- project-root
|   |-- .blinkmrc.json
|   |-- src
|   |   |-- hello.js
```

With the `src/hello.js` file implemented as:

```js
'use strict'

function sayHelloWorld() {
  console.log('Hello, World!')
}

function sayHelloGalaxy() {
  console.log('Hello, Galaxy!')
}

module.exports = {
  sayHelloWorld,
  sayHelloGalaxy,
}
```

Would result in two functions that could be scheduled separately.

### Properties

#### `label`

**Required** A human readable label for the function to display.

#### `name`

**Required** A unique identifier for the function within the scope of the Hosted API.

#### `module`

**Required** The relative path to the file to execute the function.

#### `export`

**Required** The name of the exported function in the `module` to execute the function.

#### `timeout`

**Option** The time in seconds allowed for the function to finish executing.
