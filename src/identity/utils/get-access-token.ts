import userConfig from './user-config.js'

export default function getAccessToken(): Promise<string | void> {
  return userConfig
    .getStore()
    .load()
    .then((config) => config.access_token)
}
