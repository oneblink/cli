#!/usr/bin/env node

// @flow
'use strict'

const commands = require('../lib/commands')
const { TENANTS } = require('../lib/config')

commands(TENANTS.ONEBLINK)
