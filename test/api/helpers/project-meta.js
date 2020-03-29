'use strict'

function projectMetaMock(readFn, writeFn) {
  readFn = readFn || (() => Promise.resolve({}))
  writeFn = writeFn || ((cwd, updateFn) => Promise.resolve(updateFn({})))
  return {
    read: (cwd) => readFn(cwd),
    write: (config, cwd) => writeFn(config, cwd),
  }
}

module.exports = projectMetaMock
