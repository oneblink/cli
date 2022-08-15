# OneBlink API CLI

## ES Modules

The OneBlink API CLI now supports ES Modules natively. This means you can use default and named exports in your javascript or typescript files, instead of setting your routes as an object on the `module.exports` object.

### Upgrading

Below are some code examples of how handlers will look when upgraded.

#### Function Handlers

For function exports, what was before:
```js
module.exports = function (request, response) {
  // Will be executed for all HTTP request methods
}
```
can now become:
```js
export default function (request, response) {
  // Will be executed for all HTTP request methods
}
```

#### Object Handlers

For object exports, what was before:
```js
module.exports.get = function (request, response) {
  // Will only be executed for GET HTTP method requests
}

module.exports.post = function (request, response) {
  // Will only be executed for POST HTTP method requests
}

module.exports.put = function (request, response) {
  // Will only be executed for PUT HTTP method requests
}

module.exports.delete = function (request, response) {
  // Will only be executed for DELETE HTTP method requests
}
```
can now become:
```js
export function get(request, response) {
  // Will only be executed for GET HTTP method requests
}

export function post(request, response) {
  // Will only be executed for POST HTTP method requests
}

export function put(request, response) {
  // Will only be executed for PUT HTTP method requests
}

export function delete(request, response) {
  // Will only be executed for DELETE HTTP method requests
}
```

#### package.json

The `"type"` property must be set to `"module"` in your package.json file.

```json
{
  ...
  "type": "module",
  ...
}
```
