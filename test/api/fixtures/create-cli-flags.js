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
      cwd: '.',
      force: false,
      env: 'dev',
    },
    overrides || {},
  )
}

module.exports = createCLIFlags
