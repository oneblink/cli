import objectMerge from 'object-merge'

import configHelper from './utils/config-helper.js'

export default (cwd: string, bucket: string): Promise<any> => {
  if (!bucket) {
    return Promise.reject(new Error('Scope was not defined.'))
  }

  const values = { cdn: { scope: bucket } }
  return configHelper.write(cwd, (config: any) => objectMerge(config, values))
}
