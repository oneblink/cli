/* @flow */
'use strict';

// Node.js built-ins

const os = require('os');
const path = require('path');

// foreign modules

const execa = require('execa');
const fs = require('graceful-fs');
const npmBinTester = require('npm-bin-ava-tester');
const test = require('ava');

// local modules

const lib = require('../lib/commands.js');

// this module

function copyExeSync (source /* : string */, destination /* : string */) {
  fs.writeFileSync(destination, fs.readFileSync(source), { mode: 0o777 });
}

const isWindows = os.type().indexOf('Windows') === 0;

npmBinTester(test);

const BIN_PATH = path.join(__dirname, '..', 'bin');
const MODULES_BIN_PATH = path.join(__dirname, '..', 'node_modules', '.bin');

// we're going to pretend that the "ava" executable is a `bm` command
const oldEnvPath = process.env.PATH;
test.before(() => {
  process.env.PATH = `${MODULES_BIN_PATH}:${process.env.PATH || ''}`;
  copyExeSync(
    path.join(MODULES_BIN_PATH, 'ava'),
    path.join(MODULES_BIN_PATH, 'blinkm-ava')
  );
  if (isWindows) {
    copyExeSync(
      path.join(MODULES_BIN_PATH, 'ava.cmd'),
      path.join(MODULES_BIN_PATH, 'blinkm-ava.cmd')
    );
  }
});
test.after.always(() => {
  process.env.PATH = oldEnvPath;
  fs.unlinkSync(path.join(MODULES_BIN_PATH, 'blinkm-ava'));
  if (isWindows) {
    fs.unlinkSync(path.join(MODULES_BIN_PATH, 'blinkm-ava.cmd'));
  }
});

test('list() includes blinkm-ava', (t) => {
  return lib.list()
    .then((commands) => lib.find(`blinkm-ava`, commands))
    .then((cmdPath) => {
      t.truthy(cmdPath);
      t.is(typeof cmdPath, 'string');
    });
});

test('blinkm', () => {
  return execa('node', [ BIN_PATH ]);
});

test('blinkm list-commands', () => {
  return execa('node', [ BIN_PATH, 'list-commands' ]);
});

test('blinkm does-not-exist (exit code 1)', (t) => {
  const child = execa('node', [ BIN_PATH, 'does-not-exist' ]);
  return child
    .then(() => t.fail('unexpected resolve'))
    .catch((err) => {
      t.is(child.exitCode, 1);
      t.regex(err.stderr, /"does-not-exist" is not an available bin command/);
    });
});

test('blinkm ava --version (exit code 0)', (t) => {
  const child = execa('node', [ BIN_PATH, 'ava', '--version' ]);
  return child
    .then(() => {
      t.is(child.exitCode, 0);
    });
});

test('blinkm ava ./test/does-not-exist.js (exit code 1)', (t) => {
  const child = execa('node', [ BIN_PATH, 'ava', './test/does-not-exist.js' ]);
  return child
    .then(() => t.fail('unexpected resolve'))
    .catch((err) => {
      t.is(child.exitCode, 1);
      t.notRegex(err.stderr, /"ava" is not an available bin command/);
    });
});
