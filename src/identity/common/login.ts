import UsernameLoginProvider from '../login-providers/username'
import BrowserLoginProvider from '../login-providers/browser'

export type LoginOptions = {
  password?: string
  username?: string | true
  storeJwt?: boolean
}

export default async function login(
  tenant: Tenant,
  options: LoginOptions | undefined,
): Promise<string> {
  options = options || {}
  if (options.username) {
    const loginProvider = new UsernameLoginProvider(tenant)
    return loginProvider.login(
      options.username === true ? null : options.username,
      options.password,
      options.storeJwt,
    )
  } else {
    const loginProvider = new BrowserLoginProvider(tenant)
    return loginProvider.login(options.storeJwt)
  }
}
