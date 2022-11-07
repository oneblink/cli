const environment = (
  process.env.ONEBLINK_CLI_ENVIRONMENT || 'prod'
).toLowerCase()

const subdomainSuffix = environment === 'prod' ? '' : `.${environment}`

function getOneBlinkLoginClientId() {
  switch (environment) {
    case 'test': {
      return '6j4233pg53dmghgtg4vj6urk12'
    }
    default: {
      return '25nh56b7kr3duh09tma1egsnvl'
    }
  }
}

function getCivicPlusLoginClientId() {
  switch (environment) {
    case 'test': {
      return 'lut6qaoang54idbtrv3kbti4q'
    }
    default: {
      return '5uad43ujc7h35l5t5ri6anaeos'
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
