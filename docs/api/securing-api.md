# Securing your API

## Installing the OneBlink SDK in our code

Securing code is something that's important to do. It will ensure that we are protecting our API Routes and allowing only correct users to run the end points we are writing. We can do this through the [OneBlink SDK](https://oneblink.github.io/sdk-node-js/). This means we are going to utilise Node to get the OneBlink SDK in our project. 

If you are using VS Code, you can open the terminal by pressing <code>crtl+shift+\`</code> on Windows or <code>command+shift+\`</code> on Mac.

With the open terminal in our API folder, we can run:

```bash
npm install --save @oneblink/sdk
```

This will install the OneBlink SDK to that project. If this is your first package install, it will create a folder named `node_modules` and create 2 files named `package.json` and `package-lock.json`. 

If you haven't seen these files and folder before, you can read this explanation below, if you have, skip to the next heading. 

`node_modules` is where all the code for the installed packages is stored. `package.json` is used to provide important information regarding the project. It shows you the name of the project, showing installed dependencies and developer dependencies. It can show you the version of the current project and provide you a place to write scripts that node can run for you. `package-lock.json` that shows all of the required code to install specific packages, this includes all of that packages dependencies so you can have a full guide to what has been installed. This helps node understand what has been installed and changed only necessary data on later installations. 

Now that we have installed the SDK, we can go obtain some developer keys from the Console!

## Obtaining Developer Keys

In order to use the SDK, we will need developer keys which we can generate on the Console. You have to ensure you have the correct role permissions in order to do so. This can be set under 'roles' on the side bar under the 'advanced' heading. Once in, you can edit an existing role by clicking the three buttons or you can add a new role by hitting the orange button in the bottom right. 

A modal should pop up. In here, you can set the name that you would like the key to be called. You can then select the privileges you would like the key to have too. In this case, we will need Forms, and API Deployment, much like this screenshot: 

![An image of a new key being generated on OneBlink Console](../pics/DeveloperKeyCreation.png)

After generating this key, you should see something like this:

![An example of what a developer key looks like after generation on the OneBlink Console](../pics/DeveloperKeyExample.png)

I've blacked out my keys obviously but you should have 3 rows of data, 1 visible but the other 2 are hidden with dots. Now that we have the key, let us jump back into the code. 

## Updating your Code

Now we need to go into our code and create some checks to ensure that the user is valid. The steps we will go through to achieve this are:

- Create a new FormsApp Object
- Use the VerifyJWT function from it

Now let us go down the list!

### Create a new FormsApp Object

Firstly, we need to use the FormsApp object from the OneBlink SDK so add this code to the top of your file you are working on:

```js
const formsApp = require("@oneblink/sdk/tenants/oneblink");
```

If you are using ES Modules, you can instead write:

```js
import { FormsApps } from '@oneblink/sdk/tenants/oneblink'
```

You can find out more about converting your functions to ES Module with [this article](./upgrading-to-es-modules.md).

Now that we have imported formsApp from the OneBlink SDK, we will need to grab our key that we generated on the Console before. 
Here we will write:

```js
  const formsAppsClient = new FormsApps({
    accessKey: YOUR_ACCESS_KEY,
    secretKey: YOUR_SECRET_KEY,
  })
```
replacing the values with the respective values from the Console. You can place this inside, or outside of your function. After this, in your function at the very beginning, you can use this code:

```js
    const authenticationHeader = req.headers.authorization
    if (typeof authenticationHeader !== 'string'){
      return res.setStatusCode(400).setPayload({
        message: "Error, no user logged in. User must be logged in."
      });
    }

    const token = authHeader.split(' ')[1]
    const jwtPayload = await formsAppClient.verifyJWT(token)
```

Alright so let's break this down.
First, we are grabbing the authentication header from the request that was sent to the API from the request's header. After this, we are checking to see if the header is of type string. If it is not, the user has NOT logged in! That means we cannot authenticate this user so we return a 400 on the `res` object by `setPayload(400)` to return a 400 HTTP code and return `setPayload({message: 'Error, no user logged in. User must be logged in.'})` as the payload with an error message. If there is an authentication header, we can split it so we grab the JWT token. After this, then we can run the `verifyJWT()` function with the token to verify who the user is! 

After verifying the JWT, you are free to continue doing what you need to with your API! There are other OneBlink functions that can assist you in other JWT functions. For example, you can use our `userService` from `@oneblink/sdk-core` to get the user Profile of the specific user who is logged in. 
