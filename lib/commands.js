'use strict';

// Node.js built-ins

const os = require('os');
const path = require('path');

// foreign modules

const fs = require('graceful-fs');

// this module

function fsReadDir (path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, entries) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve([]);
          return;
        }
        reject(err);
        return;
      }
      resolve(entries);
    });
  });
}

function arrayToSet (array) {
  return new Set(array);
}

function setToArray (set) {
  return [...set];
}

// filterCommands (commands: String[]) => String[]
function filterCommands (input) {
  var result = input.filter((entry) => entry.match(/^blinkm-/))
    .map((entry) => entry.replace(/^blinkm-/, ''))
    .map((entry) => path.basename(entry, path.extname(entry)));
  return setToArray(arrayToSet(result)).sort(); // unique
}

function list () {
  const PATH = process.env.PATH;
  const delimiter = os.platform().match(/^win/) ? ';' : ':';
  const paths = PATH.split(delimiter);

  return Promise.all(
    paths.map(fsReadDir)
  )
    .then((results) => {
      return filterCommands([].concat(...results));
    });
}

module.exports = { filterCommands, list };
