# OneBlink API CLI

## Scheduled Functions

Scheduled functions allow developers to run a function periodically. The function will be executed without any arguments. **The schedule the functions run on will be determined by a team member in the Console after the function has been deployed.** The schedule is not configured in source or as part of the deployment to allow customers to support the following use cases:

- different schedules for each environment E.g. Development scheduled runs Monday - Friday but not on weekends as the development infrastructure is switched off on the weekend.
- disabling the schedule for a single environment E.g. Turning off the schedule for production during a downtime period for a deployment.

### .blinkmrc.json

Functions are defined in your `.blinkmrc.json` file similar to routes. The following scheduled function definitions:

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

#### `label` (required)

A human readable label for the function to display.

#### `name` (required)

A unique identifier for the function within the scope of the Hosted API.

#### `module` (required)

The relative path to the file to execute the function.

#### `export` (required)

The name of the exported function in the `module` to execute the function.

#### `timeout` (optional)

The time in seconds allowed for the function to finish executing.
