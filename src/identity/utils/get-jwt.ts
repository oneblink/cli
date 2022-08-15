import userConfig from './user-config.js'

export default function getJWT(): Promise<string | void> {
  // Returning accessToken if id_token is not set to be backward compatible
  return userConfig
    .getStore()
    .load()
    .then((config) => config.id_token || config.accessToken)
}
