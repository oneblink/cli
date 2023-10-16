import userConfig from './user-config.js'

export default async function getRefreshToken(): Promise<string | void> {
  const config = await userConfig.getStore().load()
  return config.refresh_token
}
