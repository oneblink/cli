import configHelper from './utils/config-helper'
export default (cwd: string): Promise<any> => {
  return configHelper
    .read(cwd)
    .then((cfg) => (cfg.cdn ? cfg.cdn : {}))
    .then((cfg) => {
      // Set defaults for service
      cfg.service = cfg.service || {}

      return cfg
    })
}
