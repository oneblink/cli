# Adding a Route

This will cover these points
- [An Example Function](#an-example-function)
- [Updating the `.blinkmrc.json` file](#updating-the-blinkmrcjson-file)

## An Example Function

Next, create a folder called `routes`.

Now, in the `routes` folder, let us create a JavaScript file called `helloworld.js`. This will be an example option set that we will create.

Place the code below into the newly created file.

```js
module.exports = function () {
  return 'hello world!';
}
```

This is a simple function that will return the string `hello world!` back. 

Please keep in mind, that there is another way of writing these functions involving ES Modules, you can see how to update the function to use that method [here](./upgrading-to-es-modules.md)

## Updating the `.blinkmrc.json` file

Save your file and jump back into the `.blinkmrc.json` file.

Under `routes`, we are going to add this file to the routes so it can be accessed. Now, where it says `route`, we are going to replace with the route that we want to access this API with via a link. For Example: `/api/generic-option-set`. When this is attached to the end of the hosted API name you set in your project, it will access that code you have written.

Replace the route we copied over before with:

```json
{
  "route": "/helloworld",
  "module": "./routes/helloworld.js"
}
```

For example, the link for me would become: `josh-audits.api.oneblink.io/helloworld`.

Now, your whole `.blinkmrc.json` file should look like this:

```json
{
  "server": {
    "project": "your-api-name-here.api.oneblink.io",
    "routes": [
      {
        "route": "/helloworld",
        "module": "./routes/helloworld.js"
      }
    ],
    "cors": true
  }
}
```

You need to ensure that you update your "project" variable to match the name of the API that you set within the Console. Please ensure that while updating the routes, you do that too!

If you want to give a try at adding a more advance route, you can do that [with this article here](./integrating-api-routes.md) or you can read up more about the handlers with the [documentation located here!](./handlers.md)

Now that we have replaced this, we can login via the CLI!