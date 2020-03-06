# OneBlink API CLI

This CLI is for deploying server side code for your APIs hosted on the OneBlink API Hosting service.

## Setting Scope

Before you deploy, you will need to set the scope for your project. The scope will specify where your project will be deployed to.

This is the domain you set when creating the API endpoint within the OneBlink Console.

For example:

    oneblink api scope customer-project.api.oneblink.io

## Project Information

To view information about your project, you can use the `info` command:

    oneblink api info

This will return information about your current project, including the current scope, CORS configuration, and the Routes based on your current folder structure.

This is a good way to double check your current project status, especially when returning to an existing project at a later date.

## Local Development

While developing, you can run your code locally on your machine by using the `serve` command.

    oneblink api serve

This will create a local server so you can access your scripts as you would if they were deployed.

Any calls made to this local server will be listed in your terminal.

### Options:

#### `--port`

The port option will allow you to set a custom port. By default, port 3000 is used.

## Deploying files

### Authentication

Before you're able to deploy to an API Hosting Environment, you will need to be authenticated. This is done by logging in with the OneBlink Login Command. Please see: [OneBlink Login](../login.md) for more information on how to log in.

### Basic Deployment

To deploy your code or assets, run the `deploy` command:

    oneblink api deploy

This will automatically create all of the serverless infrastructure and configuration needed, and then upload the files in your current directory to the _dev_ environment for your API Hosting instance.

You can change the default behaviour by using additional options:

### Options:

#### `--env`

This option allows you to specify an environment. If the environment doesn't yet exist, it will be created when you first deploy to it.

    bm client deploy --env test

The above code will deploy to your _test_ environment, and will be specified as part of the sub-domain for your deployment.

For example: `https://customer-project-test.api.oneblink.io`

When you're ready to deploy to production, use the environment _prod_

    bm client deploy --env prod

This will deploy to your production environment and give you a URL that does not contain an environment tag.

For example: `https://customer-project.api.oneblink.io`

#### `--force`

This will deploy your project without asking for confirmation. This feature is designed to allow automatic deployments for those interested in an automated release.

    bm client deploy --force
