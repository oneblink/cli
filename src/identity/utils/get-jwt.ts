import userConfig from './user-config.js'

export default async function getJWT(): Promise<string | undefined> {
  // Returning accessToken if id_token is not set to be backward compatible
  const config = await userConfig.getStore().load()
  return config.id_token || config.accessToken
}
