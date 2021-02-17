import type { MapObject } from '../types'

// https://developer.mozilla.org/en-US/Add-ons/SDK/Guides/Contributor_s_Guide/Private_Properties

// simpler than alternative: https://www.npmjs.com/package/namespace

export default function createInternal(): (arg0: any) => MapObject {
  const map: WeakMap<any, MapObject> = new WeakMap()
  return (object: any): MapObject => {
    const values = map.get(object) || {}
    if (!map.has(object)) {
      map.set(object, values)
    }
    return values
  }
}
