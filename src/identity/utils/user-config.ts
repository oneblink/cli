import pkg from '../../package.js'
import * as blinkmrc from '../../blinkmrc.js'

function getStore() {
  return blinkmrc.userConfig<{
    // Setting accessToken as well as id_token to be backward compatible
    accessToken?: string
    id_token?: string
    access_token?: string
    refresh_token?: string
  }>({ name: pkg.name, ENOENTResult: {} })
}

export default {
  getStore,
}
