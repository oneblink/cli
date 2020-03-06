/* @flow */
'use strict'

/* ::
import type {CLIFlags} from '../../../lib/api/types.js'
*/

const pkg = require('../../../package.json')

function createCLIFlags(
  overrides /* : { [id:string]: string | boolean } | void */,
) /* : CLIFlags */ {
  return Object.assign(
    {
      provision: false,
      bmServerVersion: `${pkg.name}@1.0.0`,
      cwd: '.',
      force: false,
      env: 'dev',
      tenant: 'oneblink',
      tail: false,
    },
    overrides || {},
  )
}

module.exports = createCLIFlags
