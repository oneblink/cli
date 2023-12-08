import chalk from 'chalk'
import configHelper from './utils/config-helper.js'

export default async function read(cwd: string): Promise<{
  scope: string
  isSinglePageApplication?: boolean
  disableSecurityResponseHeaders?: boolean
}> {
  const cfg = await configHelper.read<{
    cdn?: {
      scope?: unknown
      disableSecurityResponseHeaders?: unknown
      isSinglePageApplication?: unknown
      objectParams?: unknown
    }
  }>(cwd)

  const { cdn } = cfg
  if (!cdn || !('scope' in cdn) || typeof cdn.scope !== 'string') {
    throw new Error(
      'Scope has not been set yet, see --help for information on how to set scope.',
    )
  }

  if (cdn.objectParams) {
    console.log(
      `${chalk.blue(
        '"objectParams" in the ".blinkmrc.json" file are obsolete. You can safely remove them.',
      )}`,
    )
  }

  return {
    scope: cdn.scope,
    isSinglePageApplication:
      'isSinglePageApplication' in cdn &&
      typeof cdn.isSinglePageApplication === 'boolean'
        ? cdn.isSinglePageApplication
        : undefined,
    disableSecurityResponseHeaders:
      'disableSecurityResponseHeaders' in cdn &&
      typeof cdn.disableSecurityResponseHeaders === 'boolean'
        ? cdn.disableSecurityResponseHeaders
        : undefined,
  }
}
