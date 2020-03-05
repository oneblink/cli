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
  const tenant = getCLICommand(command)
  commands(tenant, inputs)
} else {
  process.exitCode = 1
}

function getCLICommand(input /* : string */) /* : Tenant */ {
  switch (input.toUpperCase()) {
    case TENANTS.CIVICPLUS.id: {
      return TENANTS.CIVICPLUS
    }
    default: {
      return TENANTS.ONEBLINK
    }
  }
}
