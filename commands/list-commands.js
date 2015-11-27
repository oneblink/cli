'use strict';

// local modules

const list = require('../lib/commands').list;

// this module

list()
  .then((commands) => {
    console.log('blinkmobile list-commands\n\navailable commands:');
    commands.forEach((command) => {
      console.log(`  ${command}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
