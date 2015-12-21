'use strict';

// Node.js built-ins

const path = require('path');

// local modules

const list = require('../lib/commands').list;

// this module

list()
  .then((commands) => {
    console.log('blinkm list-commands\n\navailable commands:');
    commands
      .map((c) => path.basename(c, path.extname(c)))
      .map((c) => c.replace(/^blinkm-/, ''))
      .forEach((command) => {
        console.log(`  ${command}`);
      });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
