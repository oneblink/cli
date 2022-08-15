import userConfig from './user-config.js'

export default function getRefreshToken(): Promise<string | void> {
  return userConfig
    .getStore()
    .load()
    .then((config) => config.refresh_token)
}
