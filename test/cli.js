'use strict';

// Node.js built-ins

const path = require('path');

// foreign modules

const execa = require('execa');
const test = require('ava');

// local modules

test('blinkm', () => {
  return execa.spawn('node', [ path.join(__dirname, '..', 'bin') ])
});

test('blinkm list-commands', () => {
  return execa.spawn('node', [
    path.join(__dirname, '..', 'bin'),
    'list-commands'
  ])
});
