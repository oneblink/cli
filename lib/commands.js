'use strict';

// Node.js built-ins

const os = require('os');

// foreign modules

const fs = require('graceful-fs');

// this module

function fsReadDir (path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, entries) => {
      if (err) {
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

function list () {
  const PATH = process.env.PATH;
  const delimiter = os.platform().match(/^win/) ? ';' : ':';
  const paths = PATH.split(delimiter);

  return Promise.all(
    paths.map(fsReadDir)
  )
    .then((results) => {
      const commands = [].concat(...results)
        .filter((entry) => {
          return entry.match(/^blinkm-/);
        })
        .map((entry) => {
          return entry.replace(/^blinkm-/, '');
        });

      return setToArray(arrayToSet(commands)).sort(); // unique
    });
}

module.exports = { list };
