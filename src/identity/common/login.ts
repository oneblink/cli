import BrowserLoginProvider from '../login-providers/browser'

export default async function login(tenant: Tenant): Promise<string> {
  const loginProvider = new BrowserLoginProvider(tenant)
  return loginProvider.login(true)
}
