import userConfig from './user-config.js'

export default async function getAccessToken(): Promise<string | undefined> {
  const config = await userConfig.getStore().load()
  return config.access_token
}
