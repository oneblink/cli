'use strict'

const test = require('ava')
const execa = require('execa')
const npmBinTester = require('npm-bin-ava-tester')

const { TENANTS } = require('../lib/config')

npmBinTester(test)

test('it use correct tenant when using "oneblink" installed globally', async (t) => {
  const { stdout } = await execa('oneblink', ['--help'])
  t.truthy(stdout.includes(TENANTS.ONEBLINK.label))
})

test('it use correct tenant when using "civicplus" installed globally', async (t) => {
  const { stdout } = await execa('civicplus', ['--help'])
  t.truthy(stdout.includes(TENANTS.CIVICPLUS.label))
})
