import pkg from '../../package.js'
import * as blinkmrc from '../../blinkmrc.js'

let userConfigStore: blinkmrc.Config<{
  // Setting accessToken as well as id_token to be backward compatible
  accessToken?: string
  id_token?: string
  access_token?: string
  refresh_token?: string
}>

function getStore() {
  if (!userConfigStore) {
    userConfigStore = blinkmrc.userConfig({ name: pkg.name })
  }
  return userConfigStore
}

export default {
  getStore,
}
