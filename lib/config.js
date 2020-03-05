/* @flow */
'use strict'

const TENANTS = {
  ONEBLINK: {
    id: 'ONEBLINK',
    command: 'oneblink',
    label: 'OneBlink',
    origin: 'https://auth-api.blinkm.io',
    apiHostingBucket: 'oneblink-api-hosting-deployments-prod',
    region: 'ap-southeast-2',
  },
  CIVICPLUS: {
    id: 'CIVICPLUS',
    command: 'civicplus',
    label: 'CivicPlus',
    origin: 'https://auth-api.transform.civicplus.com',
    apiHostingBucket: 'civicplus-api-hosting-deployments-prod',
    region: 'us-east-2',
  },
}

module.exports = {
  TENANTS,
}
