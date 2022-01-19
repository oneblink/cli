# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.4] - 2022-01-19

### Fixed

- `api serve` command not allowing for `6mb` payload request limit

## [0.2.3] - 2021-11-15

### Changed

- `memorySize` max in docs for api hosting

### Removed

- username and password login option

### Dependencies

- update [aws-sdk](https://www.npmjs.com/package/aws-sdk) to [2.1002.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.1002.0) (from [2.989.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.989.0))

- update [glob](https://www.npmjs.com/package/glob) to 7.2.0 (from 7.1.7)

- update [inquirer](https://www.npmjs.com/package/inquirer) to 8.2.0 (from 8.1.4)

- update [node-fetch](https://www.npmjs.com/package/node-fetch) to 2.6.5 (from [2.6.2](https://github.com/node-fetch/node-fetch/releases/tag/v2.6.2))

## [0.2.2] - 2021-09-20

### Added

- API Gateway to Lambda version 2.0 integration

### Dependencies

- update [@hapi/boom](https://www.npmjs.com/package/@hapi/boom) to 9.1.4 (from 9.1.2)

- update [aws-sdk](https://www.npmjs.com/package/aws-sdk) to [2.989.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.989.0) (from [2.876.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.876.0))

- update [chalk](https://www.npmjs.com/package/chalk) to [4.1.2](https://github.com/chalk/chalk/releases/tag/v4.1.2) (from [4.1.0](https://github.com/chalk/chalk/releases/tag/v4.1.0))

- update [execa](https://www.npmjs.com/package/execa) to [5.1.1](https://github.com/sindresorhus/execa/releases/tag/v5.1.1) (from [5.0.0](https://github.com/sindresorhus/execa/releases/tag/v5.0.0))

- update [glob](https://www.npmjs.com/package/glob) to 7.1.7 (from 7.1.6)

- update [inquirer](https://www.npmjs.com/package/inquirer) to 8.1.4 (from 8.0.0)

- update [node-fetch](https://www.npmjs.com/package/node-fetch) to [2.6.2](https://github.com/node-fetch/node-fetch/releases/tag/v2.6.2) (from [2.6.1](https://github.com/node-fetch/node-fetch/releases/tag/v2.6.1))

- update [open](https://www.npmjs.com/package/open) to [8.2.1](https://github.com/sindresorhus/open/releases/tag/v8.2.1) (from [8.0.4](https://github.com/sindresorhus/open/releases/tag/v8.0.4))

- update [ora](https://www.npmjs.com/package/ora) to [5.4.1](https://github.com/sindresorhus/ora/releases/tag/v5.4.1) (from [5.4.0](https://github.com/sindresorhus/ora/releases/tag/v5.4.0))

- update [recursive-copy](https://www.npmjs.com/package/recursive-copy) to 2.0.13 (from 2.0.11)

## [0.2.1] - 2021-08-12

### Added

- Form Server Validation example

### Fixed

- `Referer` HTTP request header not being logged correctly

### Dependencies

- no longer depend upon [parse-package-name](https://www.npmjs.com/package/parse-package-name)

## [0.2.0] - 2021-05-13

### Changed

- **[BREAKING]** runtime version from Node.js 12 to [Node.js 14](https://nodejs.medium.com/node-js-version-14-available-now-8170d384567e)

### Dependencies

- update [@hapi/boom](https://www.npmjs.com/package/@hapi/boom) to 9.1.2 (from [9.1.1](https://github.com/hapijs/boom/releases/tag/v9.1.1))

- update [archiver](https://www.npmjs.com/package/archiver) to [5.3.0](https://github.com/archiverjs/node-archiver/releases/tag/5.3.0) (from [5.2.0](https://github.com/archiverjs/node-archiver/releases/tag/5.2.0))

- update [aws-sdk](https://www.npmjs.com/package/aws-sdk) to [2.876.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.876.0) (from [2.843.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.843.0))

- update [inquirer](https://www.npmjs.com/package/inquirer) to 8.0.0 (from 7.3.3)

- update [open](https://www.npmjs.com/package/open) to [8.0.4](https://github.com/sindresorhus/open/releases/tag/v8.0.4) (from [7.4.1](https://github.com/sindresorhus/open/releases/tag/v7.4.1))

- update [ora](https://www.npmjs.com/package/ora) to [5.4.0](https://github.com/sindresorhus/ora/releases/tag/v5.4.0) (from [5.3.0](https://github.com/sindresorhus/ora/releases/tag/v5.3.0))

## [0.1.13] - 2021-04-15

### Changed

- documentation for sending emails from Hosted APIs

## [0.1.11] - 2021-03-23

### Fixed

- `api serve` command not handling request payload and response payload correctly if they are not JSON

## [0.1.10] - 2021-02-18

### Changed

- maximum timeout validation from 300 to 900 seconds

### Dependencies

- update [@hapi/boom](https://www.npmjs.com/package/@hapi/boom) to [9.1.1](https://github.com/hapijs/boom/releases/tag/v9.1.1) (from 9.1.0)

- update [archiver](https://www.npmjs.com/package/archiver) to [5.2.0](https://github.com/archiverjs/node-archiver/releases/tag/5.2.0) (from [5.1.0](https://github.com/archiverjs/node-archiver/releases/tag/5.1.0))

- update [aws-sdk](https://www.npmjs.com/package/aws-sdk) to [2.843.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.843.0) (from [2.801.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.801.0))

- no longer depend upon [cli-table2](https://www.npmjs.com/package/cli-table2)

- update [execa](https://www.npmjs.com/package/execa) to [5.0.0](https://github.com/sindresorhus/execa/releases/tag/v5.0.0) (from [4.1.0](https://github.com/sindresorhus/execa/releases/tag/v4.1.0))

- update [meow](https://www.npmjs.com/package/meow) to [9.0.0](https://github.com/sindresorhus/meow/releases/tag/v9.0.0) (from [8.0.0](https://github.com/sindresorhus/meow/releases/tag/v8.0.0))

- update [open](https://www.npmjs.com/package/open) to [7.4.1](https://github.com/sindresorhus/open/releases/tag/v7.4.1) (from [7.3.0](https://github.com/sindresorhus/open/releases/tag/v7.3.0))

- update [ora](https://www.npmjs.com/package/ora) to [5.3.0](https://github.com/sindresorhus/ora/releases/tag/v5.3.0) (from [5.1.0](https://github.com/sindresorhus/ora/releases/tag/v5.1.0))

- update [update-notifier](https://www.npmjs.com/package/update-notifier) to [5.1.0](https://github.com/yeoman/update-notifier/releases/tag/v5.1.0) (from [5.0.1](https://github.com/yeoman/update-notifier/releases/tag/v5.0.1))

- depend upon [cli-table3](https://www.npmjs.com/package/cli-table3) [0.6.0](https://github.com/cli-table/cli-table3/blob/master/CHANGELOG.md)

## [0.1.9] - 2020-12-11

### Added

- referencing environment variables during deployments

### Dependencies

- update [archiver](https://www.npmjs.com/package/archiver) to [5.1.0](https://github.com/archiverjs/node-archiver/releases/tag/5.1.0) (from [5.0.2](https://github.com/archiverjs/node-archiver/releases/tag/5.0.2))

- update [aws-sdk](https://www.npmjs.com/package/aws-sdk) to [2.801.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.801.0) (from [2.790.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.790.0))

## [0.1.8] - 2020-11-25

### Added

- Default header allowance for `X-OneBlink-User-Token`

## [0.1.7] - 2020-11-17

### Removed

- Analytics integration

### Dependencies

- update archiver to [5.0.2](https://github.com/archiverjs/node-archiver/releases/tag/5.0.2) (from [3.1.1](https://github.com/archiverjs/node-archiver/releases/tag/3.1.1))

- update aws-sdk to [2.790.0](https://github.com/aws/aws-sdk-js/blob/master/CHANGELOG.md) (from [2.648.0](https://github.com/aws/aws-sdk-js/blob/master/CHANGELOG.md))

- update chalk to 4.1.0 (from 3.0.0)

- update execa to [4.1.0](https://github.com/sindresorhus/execa/releases/tag/v4.1.0) (from 4.0.0)

- update [inquirer](https://www.npmjs.com/package/inquirer) to 7.3.3 (from 7.1.0)

- update meow to 8.0.0 (from 6.1.0)

- update node-fetch to 2.6.1 (from 2.6.0)

- update [open](https://www.npmjs.com/package/open) to 7.3.0 (from 7.0.3)

- update ora to 5.1.0 (from 4.0.3)

- update [recursive-copy](https://www.npmjs.com/package/recursive-copy) to 2.0.11 (from 2.0.10)

- update [temp](https://www.npmjs.com/package/temp) to 0.9.4 (from 0.9.1)

- update [update-notifier](https://www.npmjs.com/package/update-notifier) to 5.0.1 (from 4.1.0)

## [0.1.6] - 2020-07-06

### Added

- `memorySize` option to API CLI configuration

## [0.1.5] - 2020-06-03

### Fixed

- `api teardown` command throwing error parsing JSON

## [0.1.4] - 2020-04-03

### Added

- `api teardown` command to delete a single API hosting environment

### Changed

- `api serve` command to use `express` instead of `hapi`
- API deployment process to be synchronous

### Dependencies

- update [@hapi/boom](https://www.npmjs.com/package/@hapi/boom) to 9.1.0 (from 9.0.0)

- no longer depend upon [@jokeyrhyme/pify-fs](https://www.npmjs.com/package/@jokeyrhyme/pify-fs)

- update [aws-sdk](https://www.npmjs.com/package/aws-sdk) to [2.648.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.648.0) (from [2.600.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.600.0))

- no longer depend upon [good](https://www.npmjs.com/package/good)

- no longer depend upon [good-console](https://www.npmjs.com/package/good-console)

- no longer depend upon [hapi](https://www.npmjs.com/package/hapi)

- no longer depend upon [js-yaml](https://www.npmjs.com/package/js-yaml)

- no longer depend upon [load-json-file](https://www.npmjs.com/package/load-json-file)

- update [meow](https://www.npmjs.com/package/meow) to [6.1.0](https://github.com/sindresorhus/meow/releases/tag/v6.1.0) (from [6.0.1](https://github.com/sindresorhus/meow/releases/tag/v6.0.1))

- update [minimist](https://www.npmjs.com/package/minimist) to 1.2.5 (from 1.2.3)

- no longer depend upon [pify](https://www.npmjs.com/package/pify)

- no longer depend upon [request](https://www.npmjs.com/package/request)

- no longer depend upon [semver](https://www.npmjs.com/package/semver)

- no longer depend upon [serverless](https://www.npmjs.com/package/serverless)

- depend upon [cors](https://www.npmjs.com/package/cors) 2.8.5

- depend upon [express](https://www.npmjs.com/package/express) [4.17.1](https://github.com/expressjs/express/releases/tag/4.17.1)

- depend upon [morgan](https://www.npmjs.com/package/morgan) [1.10.0](https://github.com/expressjs/morgan/releases/tag/1.10.0)

- depend upon [node-fetch](https://www.npmjs.com/package/node-fetch) [2.6.0](https://github.com/node-fetch/node-fetch/releases/tag/v2.6.0)

## [0.1.3] - 2020-03-26

### Fixed

- `civicplus` entry point not using CivicPlus tenant

## [0.1.2] - 2020-03-11

### Fixed

- default entry point using civicplus

## [0.1.1] - 2020-03-11

- Initial Release
