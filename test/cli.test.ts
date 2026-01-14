import { expect, test } from 'vitest'
import { execa } from 'execa'

import { TENANTS } from '../src/config.js'

test('it use correct tenant when using "oneblink" installed globally', async () => {
  const { stdout } = await execa('oneblink', ['--help'])
  return expect(stdout).toContain(TENANTS.ONEBLINK.label)
})

test('it use correct tenant when using "civicplus" installed globally', async () => {
  const { stdout } = await execa('civicplus', ['--help'])
  return expect(stdout).toContain(TENANTS.CIVICPLUS.label)
})
