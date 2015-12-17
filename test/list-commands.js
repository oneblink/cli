'use strict';

// Node.js built-ins

const path = require('path');

// foreign modules

const test = require('ava');

// local modules

const { list } = require('../lib/commands');

// this module

test('does not throw when PATH includes inaccessible entries', (t) => {
  process.env.PATH = path.join(__dirname, 'does', 'not', 'exist');
  return list()
    .then((commands) => {
      t.ok(Array.isArray(commands));
    })
    .catch((err) => {
      t.ifError(err);
    });
});
