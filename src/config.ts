const environment = (
  process.env.ONEBLINK_CLI_ENVIRONMENT || 'prod'
).toLowerCase()

const subdomainSuffix = environment === 'prod' ? '' : `-${environment}`

function getOneBlinkLoginClientId() {
  switch (environment) {
    case 'test': {
      return '4qnhooo6baoptdd5mbcfu6a2o9'
    }
    default: {
      return '2f4qdgp88bemgp3r6cilo18af'
    }
  }
}

function getCivicPlusLoginClientId() {
  switch (environment) {
    case 'test': {
      return '24anvbrtp395r5f38g7kg8r0pq'
    }
    default: {
      return '1c7lusg15jm51l7gjn8e7ce0ti'
    }
  }
}

const TENANTS: {
  ONEBLINK: Tenant
  CIVICPLUS: Tenant
} = {
  ONEBLINK: {
    id: 'ONEBLINK',
    command: 'oneblink',
    label: 'OneBlink',
    origin: `https://auth-api${subdomainSuffix}.blinkm.io`,
    apiHostingBucket: `oneblink-api-hosting-deployments-${environment}`,
    region: 'ap-southeast-2',
    loginUrl: `https://login${subdomainSuffix}.oneblink.io`,
    loginClientId: getOneBlinkLoginClientId(),
    loginCallbackUrl: `https://console${subdomainSuffix}.oneblink.io/cli-tools-callback`,
  },
  CIVICPLUS: {
    id: 'CIVICPLUS',
    command: 'civicplus',
    label: 'CivicPlus',
    origin: `https://auth-api${subdomainSuffix}.transform.civicplus.com`,
    apiHostingBucket: `civicplus-api-hosting-deployments-${environment}`,
    region: 'us-east-2',
    loginUrl: `https://login${subdomainSuffix}.transform.civicplus.com`,
    loginClientId: getCivicPlusLoginClientId(),
    loginCallbackUrl: `https://console${subdomainSuffix}.transform.civicplus.com/cli-tools-callback`,
  },
}

export { TENANTS }
