import type { UserConfigStore } from '..'

import pkg from '../../package'
import blinkmrc from '@blinkmobile/blinkmrc'

let userConfigStore: any

function getStore(): UserConfigStore {
  if (!userConfigStore) {
    userConfigStore = blinkmrc.userConfig({ name: pkg.name })
  }
  return userConfigStore
}

export default {
  getStore,
}
