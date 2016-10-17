# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

### Fixed

- CLI-8: Commands exiting with incorrect code when errors are thrown

- CLI-9: `bm list-commands` exiting before logging available commands 


## 1.1.3 - 2016-08-23


### Changed

- CLI-2: updated to [argv-one 1.0.1](https://github.com/jokeyrhyme/argv-one.js/releases/tag/1.0.1) for fixes (#18, @mymattcarroll)


## [1.1.2] - 2016-02-03


### Fixed

- now works in Node.js 4.x LTS (#7, @jokeyrhyme)

    - HelpDesk: 5592-WEGJ-0376


## [1.1.1] - 2015-12-21


### Fixed

- `bm <plugin>` (e.g. `bm acf`) works on Windows (#5)

- `bm list-commands` ignore file extensions when listing unique commands (#4)

    - this prevents both (e.g.) "acf" and "acf.cmd" from showing up Windows


## [1.1.0] - 2015-12-17


### Added

- [update-notifier](https://www.npmjs.com/package/update-notifier) integration (#1)


### Fixed

- `bm list-commands` works even when PATH contains bad entries in PATH (#2)

- attempt to improve self-references in help output on Windows (#3)


## [1.0.2] - 2015-12-01


### Fixed

- export `blinkm` instead of `blinkmobile` to align with service branding


## [1.0.1] - 2015-11-27


### Fixed

- just show the basename for the executable (instead of the full path)
