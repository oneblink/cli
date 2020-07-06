# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

### Added

- `memorySize` option to API CLI configuration

## 0.1.5 (2020-06-03)

### Fixed

- `api teardown` command throwing error parsing JSON

## 0.1.4 (2020-04-03)

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

## 0.1.3 (2020-03-26)

### Fixed

- `civicplus` entry point not using CivicPlus tenant

## 0.1.2 (2020-03-11)

### Fixed

- default entry point using civicplus

## 0.1.1 (2020-03-11)

- Initial Release
