'use strict';

// Node.js built-ins

const os = require('os');
const path = require('path');

// foreign modules

const execa = require('execa');
const fs = require('graceful-fs');
const isExe = require('is-executable').sync;

// this module

const isWindows = os.type().indexOf('Windows') === 0;

function arrayToSet (array) {
  return new Set(array);
}

function setToArray (set) {
  return Array.from(set.values());
}

function unique (array) {
  return setToArray(arrayToSet(array));
}

function fsReadDir (dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, entries) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve([]);
          return;
        }
        reject(err);
        return;
      }
      resolve(entries.map((entry) => path.join(dirPath, entry)));
    });
  });
}

// filterBlinkm (commands: String[]) => String[]
function filterBlinkm (input) {
  return unique(input.filter((i) => path.basename(i).match(/^blinkm-/)));
}

// filterExe (commands: String[]) => String[]
function filterExe (input) {
  return input.filter((i) => isExe(i));
}

// list () => Promise
function list () {
  const PATH = process.env.PATH;
  const delimiter = isWindows ? ';' : ':';
  const paths = PATH.split(delimiter);

  return Promise.all(
    paths.map(fsReadDir)
  )
    .then((results) => {
      let mergedResults = [];
      mergedResults = mergedResults.concat.apply(mergedResults, results);
      return filterExe(filterBlinkm(mergedResults));
    });
}

// basename (filePath: String) => String
function basename (filePath) {
  if (isWindows) {
    // Windows executables must have an extension, so strip it away
    return path.basename(filePath, path.extname(filePath));
  }
  return path.basename(filePath);
}

// find (needle: String, haystack: String[]) => String
function find (needle, haystack) {
  let matches;
  matches = haystack.filter((entry) => basename(entry) === needle);
  return matches[0];
}

function exec (command) {
  return list()
    .then((commands) => find(`blinkm-${command}`, commands))
    .then((cmdPath) => {
      if (!cmdPath) {
        let err = new Error('ENOENT');
        return Promise.reject(err);
      }
      return Promise.resolve(cmdPath);
    })
    .then((cmdPath) => {
      return execa(cmdPath, process.argv.slice(3), {
        cwd: process.cwd(),
        detached: false,
        env: process.env,
        stdio: 'inherit'
      });
    });
}

module.exports = { exec, filterBlinkm, find, list };
