/* @flow */
'use strict'

/* ::
import type {
  BlinkMRCServer, CorsConfiguration, RouteConfiguration, AnalyticsConfig
} from './types.js'
*/

const path = require('path')

const execa = require('execa')
const loadJsonFile = require('load-json-file')
const semver = require('semver')
const parsePackageName = require('parse-package-name')
const writeJsonFile = require('write-json-file')

const nonAlphaNumericToDashes = require('./utils/non-alpha-numeric-to-dashes.js')
const readCors = require('./cors/read.js')
const readRoutes = require('./routes/read.js')
const scope = require('./scope.js')
const variables = require('./variables.js')
const network = require('./network.js')
const updateYamlFile = require('./utils/yaml.js').updateYamlFile
const copyRecursive = require('./utils/copy-recursive.js')
const validateCors = require('./cors/validate.js')
const values = require('./values.js')
const HANDLER = 'handler'
const WRAPPER = path.join(__dirname, '..', '..', 'dist', 'wrapper.js')

function applyTemplate(cwd /* : string */) /* : Promise<void> */ {
  return executeSLSCommand(['create', '--template', 'aws-nodejs'], { cwd })
}

function copyConfiguration(
  target /* : string */,
  projectPath /* : string */,
  env /* : string */,
) /* : Promise<void> */ {
  const configPath = path.join(target, 'bm-server.json')
  return Promise.all([
    readCors(projectPath).then(cors => (cors ? validateCors(cors) : false)),
    readRoutes(projectPath),
    scope.read(projectPath),
  ]).then(results =>
    writeJsonFile(configPath, {
      cors: results[0],
      routes: results[1].map((routeConfig, index) => {
        routeConfig.module = path.posix.join('project', routeConfig.module)
        return routeConfig
      }),
      scope: results[2].project,
      env,
    }),
  )
}

function copyProject(
  source /* : string */,
  target /* : string */,
) /* : Promise<string> */ {
  const projectPath = path.join(target, 'project')
  return copyRecursive(source, projectPath).then(() => projectPath)
}

function copyWrapper(target /* : string */) /* : Promise<void> */ {
  const wrapperPath = path.join(target, `${HANDLER}.js`)
  return copyRecursive(WRAPPER, wrapperPath)
}

function executeSLSCommand(
  args /* : Array<string> */,
  options /* : { [id:string]: any } */,
) /* : Promise<void> */ {
  return execa(
    'serverless',
    args,
    Object.assign({}, options, {
      preferLocal: true,
      localDir: path.join(__dirname, '..'),
    }),
  )
}

function getFunctionName(
  cfg /* : BlinkMRCServer */,
  env /* : string */,
) /* : string */ {
  // Lambdas do not allow for any characters other than alpha-numeric and dashes in function names
  const arr = [cfg.project || '', env]
  const mapped = arr.map(nonAlphaNumericToDashes)
  return mapped.join('-')
}

function registerFunctions(
  tenant /* : Tenant */,
  target /* : string */,
  projectPath /* : string */,
  env /* : string */,
) /* : Promise<void> */ {
  return scope.read(projectPath).then(cfg =>
    updateServerlessYamlFile(target, config => {
      config.service = nonAlphaNumericToDashes(cfg.project || '')
      config.provider = config.provider || {}
      config.provider.region = tenant.region
      config.provider.stage = env

      const functionName = getFunctionName(cfg, env)
      config.functions = {
        [functionName]: {
          events: [
            {
              http: 'ANY {path+}',
            },
          ],
          handler: `${HANDLER}.handler`,
          name: functionName,
          description: `Server CLI Lambda function for project: ${cfg.project ||
            ''}`,
          timeout: cfg.timeout || values.DEFAULT_TIMEOUT_SECONDS,
        },
      }

      return config
    }),
  )
}

function registerDeploymentBucket(
  target /* : string */,
  deploymentBucket /* : string | void */,
) /* : Promise<void> */ {
  if (!deploymentBucket) {
    return Promise.resolve()
  }
  return updateServerlessYamlFile(target, config => {
    config.provider = config.provider || {}
    config.provider.deploymentBucket = deploymentBucket
    return config
  })
}

function registerExecutionRole(
  target /* : string */,
  executionRole /* : string | void */,
) /* : Promise<void> */ {
  if (!executionRole) {
    return Promise.resolve()
  }
  return updateServerlessYamlFile(target, config => {
    config.provider = config.provider || {}
    config.provider.role = executionRole
    return config
  })
}

function registerRootProxy(
  target /* : string */,
  env /* : string */,
) /* : Promise<void> */ {
  // TODO: detect root route Lambda function (if any) and skip this proxy

  // https://serverless.com/framework/docs/providers/aws/events/apigateway#setting-an-http-proxy-on-api-gateway

  return loadJsonFile(path.join(__dirname, 'root-route-proxy.json')).then(
    resources =>
      updateServerlessYamlFile(target, config => {
        config.resources = resources
        return config
      }),
  )
}

function registerVariables(
  target /* : string */,
  projectPath /* : string */,
  env /* : string */,
  analyticsConfig /* : AnalyticsConfig */,
) /* : Promise<void> */ {
  return variables.read(projectPath, env).then(envVars => {
    if (analyticsConfig.origin && analyticsConfig.collectorToken) {
      envVars.ONEBLINK_ANALYTICS_ORIGIN = analyticsConfig.origin
      envVars.ONEBLINK_ANALYTICS_COLLECTOR_TOKEN =
        analyticsConfig.collectorToken
    }

    if (!Object.keys(envVars).length) {
      return
    }

    return updateServerlessYamlFile(target, config => {
      config.provider = config.provider || {}
      config.provider.environment = envVars
      return config
    })
  })
}

async function registerVpc(
  target /* : string */,
  projectPath /* : string */,
  env /* : string */,
  vpcSecurityGroups /* : string | void */,
  vpcSubnets /* : string | void */,
  separator /* : string */,
) /* : Promise<void> */ {
  const securityGroupIds /* : string[] */ = []
  const subnetIds /* : string[] */ = []

  // Configuration in .blinkmrc file takes precedence over the CLI fags
  const networkConfiguration = await network.readNetwork(projectPath, env)
  if (networkConfiguration) {
    securityGroupIds.push(...networkConfiguration.vpcSecurityGroups)
    subnetIds.push(...networkConfiguration.vpcSubnets)
  } else {
    if (typeof vpcSecurityGroups === 'string') {
      securityGroupIds.push(...vpcSecurityGroups.split(separator))
    }
    if (typeof vpcSubnets === 'string') {
      subnetIds.push(...vpcSubnets.split(separator))
    }
  }

  // https://serverless.com/framework/docs/providers/aws/guide/functions#vpc-configuration
  return updateServerlessYamlFile(target, config => {
    config.provider = config.provider || {}
    config.provider.vpc = {
      securityGroupIds: securityGroupIds
        .map(securityGroup => securityGroup.trim())
        .filter(securityGroup => !!securityGroup),
      subnetIds: subnetIds
        .map(subnet => subnet.trim())
        .filter(subnet => !!subnet),
    }
    return config
  })
}

function registerNodeVersion(
  target /* : string */,
  bmServerVersion /* : string */,
) /* : Promise<void> */ {
  return updateServerlessYamlFile(target, config => {
    config.provider = config.provider || {}
    const { version } = parsePackageName(bmServerVersion)
    switch (semver.major(version)) {
      case 0: {
        config.provider.runtime = 'nodejs12.x'
        break
      }
    }
    return config
  })
}

function updateServerlessYamlFile(
  target /* : string */,
  updater /* : (data: Object) => Object */,
) /* : Promise<void> */ {
  const configPath = path.join(target, 'serverless.yml')
  return updateYamlFile(configPath, updater)
}

module.exports = {
  applyTemplate,
  copyConfiguration,
  copyProject,
  copyWrapper,
  executeSLSCommand,
  getFunctionName,
  registerDeploymentBucket,
  registerExecutionRole,
  registerFunctions,
  registerNodeVersion,
  registerRootProxy,
  registerVariables,
  registerVpc,
}
