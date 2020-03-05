# OneBlink CDN CLI

This tool is for deploying client side code for web apps to the OneBlink CDN.

## Setting Scope

Before you deploy, you will need to set the scope for your project. The scope will specify where your project will be deployed to.

This is the domain you set when creating the CDN address within the OneBlink Console.

```sh
oneblink cdn scope customer-project.cdn.oneblink.io
```

## Scope Information

```sh
oneblink cdn scope
```

Will tell you what your bucket name is currently set to.

## Deploying files

### Authentication

Before you're able to deploy to a CDN Hosting Environment, you will need to be authenticated. This is done by logging in with the OneBlink Login Command. Please see: [OneBlink Login](../../login/overview.md) for more information on how to log in.

### Example

Running:

```
oneblink cdn deploy www
```

on a directory with the following:

```
|-- .blinkmrc.json
|-- www
|   |-- index.html
|   |-- js
|   |   |-- app.js
|   |-- img
|   |   |-- logo.png
|   |   |-- cta.jpg
|   |-- css
|   |   |-- layout.css
|   |   |-- bootstrap.css
```

will deploy the following folder structure on the CDN:

```
|-- index.html
|-- js
|   |-- app.js
|-- img
|   |-- logo.png
|   |-- cta.jpg
|-- css
|   |-- layout.css
|   |-- bootstrap.css
```

## Removing files from the cdn

Remove the files from your local folder, then deploy using `--prune`:

```sh
oneblink cdn deploy <path-to-files> --env <environment> --cwd <path-to-project> --prune
```

## Usage

```sh
oneblink cdn --help
```

```
Usage: oneblink cdn <command>

Where command is one of:

  scope, deploy

Initial settings:
    scope                 => outputs the current scope
    scope <S3Bucket>      => sets the bucket
      --region <S3Region> => optionally sets the region
      --cwd <path>        => outputs or set the scope in <path>
      --debug             => output debug information

Deploying client side code:

    deploy                => uploads files in the current working directory to the scoped bucket
      <path>              => uploads files in <path> (relative to the --cwd flag) to the scoped bucket
      --env <environment> => optionally sets the environment to deploy to, defaults to 'dev'
      --force             => deploy without confirmation
      --skip              => bypass unchanged files (default)
      --no-skip           => upload all files, including unchanged
      --prune             => remove files that do not exist locally from the server
      --cwd <path>        => specify the directory containing .blinkmrc.json file (defaults to '.')
      --debug             => output debug information
```

### .blinkmignore

Skip ignored files and directories during upload.

See [.blinkmignore](https://github.com/blinkmobile/aws-s3.js#blinkmignore)
