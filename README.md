# cli [![AppVeyor Status](https://ci.appveyor.com/api/projects/status/github/blinkmobile/cli?branch=master&svg=true)](https://ci.appveyor.com/project/blinkmobile/cli) [![Travis CI Status](https://travis-ci.org/blinkmobile/cli.svg?branch=master)](https://travis-ci.org/blinkmobile/cli)

[![Greenkeeper badge](https://badges.greenkeeper.io/blinkmobile/cli.svg)](https://greenkeeper.io/)

primary entry point for our CLI tools

[![npm module](https://img.shields.io/npm/v/@blinkmobile/cli.svg)](https://www.npmjs.com/package/@blinkmobile/cli)
[![Build Status](https://travis-ci.org/blinkmobile/cli.png)](https://travis-ci.org/blinkmobile/cli)


## Requirements

- [Node.js](https://nodejs.org/) 5.0 or newer
- NPM 3.0 or newer


## Installation

```sh
npm install -g @blinkmobile/cli
```


## Usage

```sh
blinkm list-commands

# shorter "bm" for convenience
bm list-commands
```


## Commands

- `list-commands` shows available commands

Other commands are available separately:

- [`acf`](https://github.com/blinkmobile/appcache-fetcher.js) (AppCache Fetcher)
- [`surge`](https://github.com/blinkmobile/surge-cli)
