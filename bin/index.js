#!/usr/bin/env node

// @flow
'use strict'

const path = require('path')

const argvOne = require('argv-one')
const minimist = require('minimist')
const updateNotifier = require('update-notifier')
const enginesNotify = require('package-engines-notifier').enginesNotify

const commands = require('../lib/commands')
const { TENANTS } = require('../lib/config')
const pkg = require('../package.json')

const command = path.basename(argvOne({ argv: process.argv, pkg }))

updateNotifier({ pkg }).notify()

const { _: inputs } = minimist(process.argv.slice(2))

if (!enginesNotify({ pkg: pkg })) {
  // no engine trouble, proceed :)
  // $FlowFixMe
  const tenantId /* : 'ONEBLINK' | 'CIVICPLUS' */ = command.toUpperCase()
  const tenant /* : Tenant */ = TENANTS[tenantId]
  commands(tenant, inputs)
} else {
  process.exitCode = 1
}
