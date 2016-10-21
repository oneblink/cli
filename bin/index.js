#!/usr/bin/env node

// foreign modules

const updateNotifier = require('update-notifier');

// local modules

const pkg = require('./package.json');

// this module

updateNotifier({pkg}).notify();

require('..');
