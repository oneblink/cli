# OneBlink CDN CLI

This tool is for deploying client side code for web apps to the OneBlink CDN.

## Usage

See the CLI help the CDN Command by running the following:

```sh
oneblink cdn --help
```

## Setting Scope

Before you deploy, you will need to set the scope for your project. The scope will specify where your project will be deployed to.

This is the domain you set when creating the CDN address within the OneBlink Console.

```sh
oneblink cdn scope customer-project.cdn.oneblink.io
```

## Deploying files

### Authentication

Before you're able to deploy to a CDN Hosting Environment, you will need to be authenticated. This is done by logging in with the OneBlink Login Command. Please see: [OneBlink Login](../login.md) for more information on how to log in.

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

### .blinkmignore

Skip ignored files and directories during upload.

See [.blinkmignore](https://github.com/oneblink/aws-s3.js#blinkmignore)

## Single-page Applications

[SPA (Single-page application)](https://developer.mozilla.org/en-US/docs/Glossary/SPA) require that all URL paths return the `index.html` file and a 200 HTTP status response code. This is not the default configuration for a CDN Hosting environment. However, it simple to turn on. In your `.blinkmrc.json` file, simple add a `isSinglePageApplication` with a value of `true` under the `cdn` property.

### Example

```json
{
  "cdn": {
    "scope": "customer-project.cdn.oneblink.io",
    "isSinglePageApplication": true,
  }
}
```
