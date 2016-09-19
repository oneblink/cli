'use strict';

// Node.js built-ins

const os = require('os');
const path = require('path');

// foreign modules

const test = require('ava');

// local modules

const { filterBlinkm, list, find } = require('../lib/commands');

// this module

const isWindows = os.type().indexOf('Windows') === 0;

test('does not throw when PATH includes inaccessible entries', (t) => {
  process.env.PATH = path.join(__dirname, 'does', 'not', 'exist');
  return list()
    .then((commands) => {
      t.truthy(Array.isArray(commands));
    })
    .catch((err) => {
      t.ifError(err);
    });
});

test('filterBlinkm(): skips duplicate entries', (t) => {
  t.deepEqual(
    filterBlinkm([ 'blinkm-abc', 'blinkm-def', 'blinkm-abc', 'ghi' ]),
    [ 'blinkm-abc', 'blinkm-def' ]
  );
});

if (!isWindows) {
  const binPathNixes = '/usr/local/bin';

  test('find(): OS X / Linux style', (t) => {
    t.is(
      find('blinkm-def', [
        `${binPathNixes}/blinkm-abc`,
        `${binPathNixes}/blinkm-def.abc`,
        `${binPathNixes}/blinkm-def`,
        `${binPathNixes}/blinkm-ghi`
      ]),
      `${binPathNixes}/blinkm-def`
    );
  });
}

if (isWindows) {
  const binPathWindows = 'C:\\Users\\user\\AppData\\Roaming\\npm';

  test('find(): Windows style', (t) => {
    t.is(
      find('blinkm-def', [
        `${binPathWindows}\\blinkm-abc.cmd`,
        `${binPathWindows}\\blinkm-def.abc.cmd`,
        `${binPathWindows}\\blinkm-def.cmd`,
        `${binPathWindows}\\ghi.cmd`
      ]),
      `${binPathWindows}\\blinkm-def.cmd`
    );
  });
}
