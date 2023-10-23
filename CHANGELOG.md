# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.3.0] - 2023-10-23

## [3.2.1] - 2023-09-07

### Fixed

- API deployment project zip files being corrupted after upload if a single part fails in the multi-part upload process

## [3.2.0] - 2023-08-28

### Dependencies

- no longer depend upon [@blinkmobile/blinkmrc](https://www.npmjs.com/package/@blinkmobile/blinkmrc)

- depend upon [appdirectory](https://www.npmjs.com/package/appdirectory) 0.1.0

- depend upon [load-json-file](https://www.npmjs.com/package/load-json-file) [7.0.1](https://github.com/sindresorhus/load-json-file/releases/tag/v7.0.1)

## [3.1.0] - 2023-08-10

### Added

- scheduled functions schedule output after deployment

### Dependencies

- depend upon [log-symbols](https://www.npmjs.com/package/log-symbols) [5.1.0](https://github.com/sindresorhus/log-symbols/releases/tag/v5.1.0)

## [3.0.0] - 2023-08-01

### Added

- `cdn teardown` command to delete a single CDN hosting environment

### Removed

- **[BREAKING]** `.blinkmignore` support for `cdn deploy` command
- **[BREAKING]** `--no-skip` flag for `cdn deploy` command, files that have not changed are not uploaded

### Dependencies

- no longer depend upon [@blinkmobile/aws-s3](https://www.npmjs.com/package/@blinkmobile/aws-s3)

- no longer depend upon [aws-sdk](https://www.npmjs.com/package/aws-sdk)

- depend upon [@aws-sdk/client-s3](https://www.npmjs.com/package/@aws-sdk/client-s3) [3.379.1](https://github.com/aws/aws-sdk-js-v3/releases/tag/v3.379.1)

- depend upon [@aws-sdk/lib-storage](https://www.npmjs.com/package/@aws-sdk/lib-storage) [3.379.1](https://github.com/aws/aws-sdk-js-v3/releases/tag/v3.379.1)

- depend upon [mime-types](https://www.npmjs.com/package/mime-types) [2.1.35](https://github.com/jshttp/mime-types/releases/tag/2.1.35)

- depend upon [s3-sync-client](https://www.npmjs.com/package/s3-sync-client) [4.3.1](https://github.com/jeanbmar/s3-sync-client/blob/master/CHANGELOG.md)

## [2.1.0] - 2023-07-12

### Added

- scheduled functions to API deployments

### Changed

- options sets now referred to as lists

### Dependencies

- update [aws-sdk](https://www.npmjs.com/package/aws-sdk) to [2.1411.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.1411.0) (from [2.1357.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.1357.0))

- update [chalk](https://www.npmjs.com/package/chalk) to [5.3.0](https://github.com/chalk/chalk/releases/tag/v5.3.0) (from [5.2.0](https://github.com/chalk/chalk/releases/tag/v5.2.0))

- update [glob](https://www.npmjs.com/package/glob) to 10.3.1 (from 10.0.0)

- update [inquirer](https://www.npmjs.com/package/inquirer) to 9.2.7 (from 9.1.5)

- update [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) to [9.0.1](https://github.com/auth0/node-jsonwebtoken/blob/master/CHANGELOG.md) (from [9.0.0](https://github.com/auth0/node-jsonwebtoken/blob/master/CHANGELOG.md))

- update [meow](https://www.npmjs.com/package/meow) to [12.0.1](https://github.com/sindresorhus/meow/releases/tag/v12.0.1) (from [11.0.0](https://github.com/sindresorhus/meow/releases/tag/v11.0.0))

- update [ora](https://www.npmjs.com/package/ora) to [6.3.1](https://github.com/sindresorhus/ora/releases/tag/v6.3.1) (from [6.3.0](https://github.com/sindresorhus/ora/releases/tag/v6.3.0))

## [2.0.0] - 2023-05-02

### Changed

- **[BREAKING]** runtime version from Node.js 16 to [Node.js 18](https://nodejs.org/en/blog/announcements/v18-release-announce)

### Dependencies

- update [@hapi/boom](https://www.npmjs.com/package/@hapi/boom) to 10.0.1 (from [10.0.0](https://github.com/hapijs/boom/releases/tag/v10.0.0))

- update [aws-sdk](https://www.npmjs.com/package/aws-sdk) to [2.1357.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.1357.0) (from [2.1194.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.1194.0))

- update [chalk](https://www.npmjs.com/package/chalk) to [5.2.0](https://github.com/chalk/chalk/releases/tag/v5.2.0) (from [5.0.1](https://github.com/chalk/chalk/releases/tag/v5.0.1))

- update [cli-table3](https://www.npmjs.com/package/cli-table3) to [0.6.3](https://github.com/cli-table/cli-table3/releases/tag/v0.6.3) (from [0.6.2](https://github.com/cli-table/cli-table3/releases/tag/v0.6.2))

- update [execa](https://www.npmjs.com/package/execa) to [7.1.1](https://github.com/sindresorhus/execa/releases/tag/v7.1.1) (from [6.1.0](https://github.com/sindresorhus/execa/releases/tag/v6.1.0))

- update [express](https://www.npmjs.com/package/express) to [4.18.2](https://github.com/expressjs/express/releases/tag/4.18.2) (from [4.18.1](https://github.com/expressjs/express/releases/tag/4.18.1))

- update [glob](https://www.npmjs.com/package/glob) to 10.0.0 (from 8.0.3)

- update [inquirer](https://www.npmjs.com/package/inquirer) to 9.1.5 (from 9.1.0)

- update [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) to [9.0.0](https://github.com/auth0/node-jsonwebtoken/blob/master/CHANGELOG.md) (from [8.5.1](https://github.com/auth0/node-jsonwebtoken/blob/master/CHANGELOG.md))

- update [meow](https://www.npmjs.com/package/meow) to [11.0.0](https://github.com/sindresorhus/meow/releases/tag/v11.0.0) (from [10.1.3](https://github.com/sindresorhus/meow/releases/tag/v10.1.3))

- update [minimist](https://www.npmjs.com/package/minimist) to [1.2.8](https://github.com/minimistjs/minimist/blob/master/CHANGELOG.md) (from [1.2.6](https://github.com/minimistjs/minimist/blob/master/CHANGELOG.md))

- update [node-fetch](https://www.npmjs.com/package/node-fetch) to [3.3.1](https://github.com/node-fetch/node-fetch/releases/tag/v3.3.1) (from [3.2.10](https://github.com/node-fetch/node-fetch/releases/tag/v3.2.10))

- update [open](https://www.npmjs.com/package/open) to [9.1.0](https://github.com/sindresorhus/open/releases/tag/v9.1.0) (from [8.4.0](https://github.com/sindresorhus/open/releases/tag/v8.4.0))

- update [ora](https://www.npmjs.com/package/ora) to [6.3.0](https://github.com/sindresorhus/ora/releases/tag/v6.3.0) (from [6.1.2](https://github.com/sindresorhus/ora/releases/tag/v6.1.2))

## [1.3.2] - 2023-04-20

### Added

- `@microsoft/eslint-plugin-sdl` eslint plugin

## [1.3.1] - 2023-02-16

### Added

- More developer docs for getting started with OneBlink APIs

## [1.3.0] - 2022-12-12

### Fixed

- `api serve` command not resolving module paths on Windows operating systems

### Added

- [Single-page application support](./docs/cdn/overview.md#single-page-applications) to CDN Hosting
- [Disable security response headers support](./docs/cdn/overview.md#security-response-headers) to CDN Hosting

## [1.2.0] - 2022-11-13

### Changed

- login configuration

## [1.1.1] - 2022-10-26

### Changed

- subdomainSuffix for test environments

## [1.1.0] - 2022-08-16

### Added

- [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) support to API Hosting projects by adding `.mjs` to file extensions or adding `{ "type": "module" }` to your `package.json` file.

### Changed

- source to [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) from CommonJS

### Dependencies

- update [@hapi/boom](https://www.npmjs.com/package/@hapi/boom) to [10.0.0](https://github.com/hapijs/boom/releases/tag/v10.0.0) (from 9.1.4)

- update [archiver](https://www.npmjs.com/package/archiver) to [5.3.1](https://github.com/archiverjs/node-archiver/releases/tag/5.3.1) (from [5.3.0](https://github.com/archiverjs/node-archiver/releases/tag/5.3.0))

- update [aws-sdk](https://www.npmjs.com/package/aws-sdk) to [2.1194.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.1194.0) (from [2.1002.0](https://github.com/aws/aws-sdk-js/releases/tag/v2.1002.0))

- update [chalk](https://www.npmjs.com/package/chalk) to [5.0.1](https://github.com/chalk/chalk/releases/tag/v5.0.1) (from [4.1.2](https://github.com/chalk/chalk/releases/tag/v4.1.2))

- update [cli-table3](https://www.npmjs.com/package/cli-table3) to [0.6.2](https://github.com/cli-table/cli-table3/releases/tag/v0.6.2) (from [0.6.0](https://github.com/cli-table/cli-table3/releases/tag/v0.6.0))

- update [execa](https://www.npmjs.com/package/execa) to [6.1.0](https://github.com/sindresorhus/execa/releases/tag/v6.1.0) (from [5.1.1](https://github.com/sindresorhus/execa/releases/tag/v5.1.1))

- update [express](https://www.npmjs.com/package/express) to [4.18.1](https://github.com/expressjs/express/releases/tag/4.18.1) (from [4.17.1](https://github.com/expressjs/express/releases/tag/4.17.1))

- update [glob](https://www.npmjs.com/package/glob) to 8.0.3 (from 7.2.0)

- update [inquirer](https://www.npmjs.com/package/inquirer) to 9.1.0 (from 8.2.0)

- update [meow](https://www.npmjs.com/package/meow) to [10.1.3](https://github.com/sindresorhus/meow/releases/tag/v10.1.3) (from [9.0.0](https://github.com/sindresorhus/meow/releases/tag/v9.0.0))

- update [minimist](https://www.npmjs.com/package/minimist) to 1.2.6 (from 1.2.5)

- update [node-fetch](https://www.npmjs.com/package/node-fetch) to [3.2.10](https://github.com/node-fetch/node-fetch/releases/tag/v3.2.10) (from [2.6.7](https://github.com/node-fetch/node-fetch/releases/tag/v2.6.7))

- update [open](https://www.npmjs.com/package/open) to [8.4.0](https://github.com/sindresorhus/open/releases/tag/v8.4.0) (from [8.2.1](https://github.com/sindresorhus/open/releases/tag/v8.2.1))

- update [ora](https://www.npmjs.com/package/ora) to [6.1.2](https://github.com/sindresorhus/ora/releases/tag/v6.1.2) (from [5.4.1](https://github.com/sindresorhus/ora/releases/tag/v5.4.1))

- update [recursive-copy](https://www.npmjs.com/package/recursive-copy) to 2.0.14 (from 2.0.13)

- update [update-notifier](https://www.npmjs.com/package/update-notifier) to [6.0.2](https://github.com/yeoman/update-notifier/releases/tag/v6.0.2) (from [5.1.0](https://github.com/yeoman/update-notifier/releases/tag/v5.1.0))

- update [write-json-file](https://www.npmjs.com/package/write-json-file) to [5.0.0](https://github.com/sindresorhus/write-json-file/releases/tag/v5.0.0) (from [4.3.0](https://github.com/sindresorhus/write-json-file/releases/tag/v4.3.0))

## [1.0.0] - 2022-07-04

### Changed

- **[BREAKING]** runtime version from Node.js 14 to [Node.js 16](https://medium.com/the-node-js-collection/node-js-16-available-now-7f5099a97e70)

### Dependencies

- update [node-fetch](https://www.npmjs.com/package/node-fetch) to [2.6.7](https://github.com/node-fetch/node-fetch/releases/tag/v2.6.7) (from 2.6.5)

## [0.3.0] - 2022-02-10

### Changed

- **[BREAKING]** `request.url.query` to support multi-value query string parameters. This means the object may contain entries that have a `string` value **or** a `string[]` value

### Added

- `request.url.querystring` to API Hosting request object

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
