import pkg from './package.js'

const environment = (
  process.env.ONEBLINK_CLI_ENVIRONMENT || 'prod'
).toLowerCase()

const subdomainSuffix = environment === 'prod' ? '' : `.${environment}`

const USER_AGENT = `Node.js ${pkg.name} / ${pkg.version}`

function getOneBlinkLoginClientId() {
  switch (environment) {
    case 'test': {
      return '47gf19mbakolufiktuob0gibvi'
    }
    default: {
      return '703kvifao2pt1f80l0j9hr3n8g'
    }
  }
}

function getCivicPlusLoginClientId() {
  switch (environment) {
    case 'test': {
      return '79jeq6j5gbi3ug1p5o13b3chbh'
    }
    default: {
      return '68cf2gnp6ckjiha3hf1pqe70os'
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
    productLongName: 'OneBlink LcS',
    productShortName: 'OneBlink LcS',
    consoleOrigin: `https://console${subdomainSuffix}.oneblink.io`,
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
    productLongName: 'CivicOptimize Productivity',
    productShortName: 'Productivity',
    consoleOrigin: `https://console${subdomainSuffix}.transform.civicplus.com`,
    origin: `https://auth-api${subdomainSuffix}.transform.civicplus.com`,
    apiHostingBucket: `civicplus-api-hosting-deployments-${environment}`,
    region: 'us-east-2',
    loginUrl: `https://login${subdomainSuffix}.transform.civicplus.com`,
    loginClientId: getCivicPlusLoginClientId(),
    loginCallbackUrl: `https://console${subdomainSuffix}.transform.civicplus.com/cli-tools-callback`,
  },
}

export { TENANTS, USER_AGENT }
