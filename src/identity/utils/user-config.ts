import pkg from '../../package.js'
import blinkmrc, { ConfigStore } from '@blinkmobile/blinkmrc'

let userConfigStore: ConfigStore

function getStore() {
  if (!userConfigStore) {
    userConfigStore = blinkmrc.userConfig({ name: pkg.name })
  }
  return userConfigStore
}

export default {
  getStore,
}
