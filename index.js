'use strict';

// Node.js built-ins

const path = require('path');

// foreign modules

const argvOne = require('argv-one');
const parseArgs = require('minimist');
const updateNotifier = require('update-notifier');

// local modules

const exec = require('./lib/commands').exec;
const pkg = require('./package.json');

// this module

updateNotifier({pkg}).notify();

const cmd = path.basename(argvOne({ argv: process.argv, pkg }));

const parsedArgs = parseArgs(process.argv.slice(2));

function showHelp () {
  console.log(`usage:\n  ${cmd} <command> ...\n`);
  console.log(`example:\n  ${cmd} list-commands`);
}

if (!parsedArgs._.length) {
  showHelp();
  process.exit(0);
}

const command = parsedArgs._[0];

if (command === 'list-commands') {
  require('./commands/list-commands');
  process.exit(0);
}

exec(command)
  .catch((err) => {
    if (err && err.code === 'ENOENT') {
      console.error(`Error: "${command}" is not an available ${cmd} command\n`);
      showHelp();
    }
    process.exit(1);
  });
