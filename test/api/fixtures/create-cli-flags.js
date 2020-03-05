/* @flow */
'use strict'

/* ::
import type {CLIFlags} from '../../../lib/api/types.js'
*/

function createCLIFlags(
  overrides /* : { [id:string]: string | boolean } | void */,
) /* : CLIFlags */ {
  return Object.assign(
    {
      provision: false,
      bmServerVersion: '1.0.0',
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
