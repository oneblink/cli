/* @flow */

/* :: import type { MapObject } from '../types.js' */

// https://developer.mozilla.org/en-US/Add-ons/SDK/Guides/Contributor_s_Guide/Private_Properties

// simpler than alternative: https://www.npmjs.com/package/namespace

function createInternal() {
  const map /* : WeakMap<Object, MapObject> */ = new WeakMap()
  return (object /* : Object */) /* : MapObject */ => {
    const values = map.get(object) || {}
    if (!map.has(object)) {
      map.set(object, values)
    }
    return values
  }
}

module.exports = {
  createInternal,
}
