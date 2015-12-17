'use strict';

// Node.js built-ins

const path = require('path');

// foreign modules

const test = require('ava');

// local modules

const { filterCommands, list } = require('../lib/commands');

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

test('filter out duplicate entries', (t) => {
  t.same(
    filterCommands([ 'blinkm-abc', 'blinkm-def', 'blinkm-abc' ]),
    [ 'abc', 'def' ]
  );
});

test('filter out duplicate entries ignoring extensions', (t) => {
  t.same(
    filterCommands([ 'blinkm-abc', 'blinkm-def', 'blinkm-abc.cmd' ]),
    [ 'abc', 'def' ]
  );
});
