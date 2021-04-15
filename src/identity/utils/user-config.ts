import pkg from '../../package'
import blinkmrc from '@blinkmobile/blinkmrc'

export type UserConfigStore = {
  load: () => Promise<any>
  update: (config: any) => Promise<any>
}

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
