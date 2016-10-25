#!/usr/bin/env node

// foreign modules

const enginesNotify = require('package-engines-notifier').enginesNotify;
const updateNodejsNotifier = require('update-nodejs-notifier').updateNodejsNotifier;
const updateNotifier = require('update-notifier');

// local modules

const pkg = require('../package.json');

// this module

updateNotifier({ pkg: pkg }).notify();

updateNodejsNotifier();

if (!enginesNotify({ pkg: pkg })) {
  // no engine trouble, proceed :)
  require('..');
} else {
  process.exitCode = 1;
}
