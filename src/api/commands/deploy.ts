import { APITypes } from '@oneblink/types'
import { fileURLToPath, URL } from 'url'
import path from 'path'
import ora from 'ora'
import temp from 'temp'
import { writeJsonFile } from 'write-json-file'
import type {
  BlinkMRCServer,
  CLIFlags,
  CLIOptions,
  DeploymentCredentials,
} from '../types.js'
import info from './info.js'
import deploy from '../deploy.js'
import scope from '../scope.js'
import readCors from '../cors/read.js'
import readRoutes from '../routes/read.js'
import network from '../network.js'
import validateCors from '../cors/validate.js'
import { ENTRY_FUNCTION } from '../handlers.js'
import copyRecursive from '../utils/copy-recursive.js'
import values from '../values.js'
import variables from '../variables.js'
import readScheduledFunctions from '../scheduledFunctions/read.js'

export default async function (
  tenant: Tenant,
  input: Array<string>,
  flags: CLIFlags,
  logger: typeof console,
  options: CLIOptions,
): Promise<void> {
  const oneblinkAPIClient = options.oneblinkAPIClient
  const cwd = flags.cwd
  const env = flags.env
  const force = flags.force
  await info(tenant, input, flags, logger, options)
  const confirmation = await deploy.confirm(logger, force, env)
  if (!confirmation) {
    return
  }

  const config = await scope.read(cwd)

  const deploymentCredentials = await deploy.authenticate(
    oneblinkAPIClient,
    config,
    env,
  )

  const [out, apiDeploymentPayload] = await copy(
    deploymentCredentials,
    config,
    cwd,
    env,
  )
  await deploy.pruneDevDependencies(out)
  const zipFilePath = await deploy.zip(out)
  await deploy.upload(zipFilePath, deploymentCredentials)
  await deploy.deploy(
    tenant,
    oneblinkAPIClient,
    apiDeploymentPayload,
    env,
    logger,
  )
}

async function copy(
  deploymentCredentials: DeploymentCredentials,
  config: BlinkMRCServer,
  cwd: string,
  env: string,
): Promise<[string, APITypes.APIDeploymentPayload]> {
  const spinner = ora('Validating project...').start()
  try {
    const scope = config.project
    if (!scope) {
      throw new Error('scope has not been set yet')
    }

    const target = await temp.mkdir('api-deployment')

    // Copy project code
    await copyRecursive(cwd, deploy.getProjectPath(target))

    // Copy AWS Lambda entry point handler
    const HANDLER = 'handler'
    const __dirname = fileURLToPath(new URL('.', import.meta.url))

    const wrapperPath = path.join(__dirname, '..', '..', 'api-handler.js')
    const handlerPath = path.join(target, `${HANDLER}.mjs`)
    await copyRecursive(wrapperPath, handlerPath)

    // Copy configuration file required by handler
    const configPath = path.join(target, 'bm-server.json')

    const [cors, routes, networkConfig, envVars, scheduledFunctions] =
      await Promise.all([
        readCors(cwd),
        readRoutes(cwd),
        network.readNetwork(cwd, env),
        variables.read(cwd, env),
        readScheduledFunctions(cwd),
      ])

    const apiDeploymentPayload: APITypes.APIDeploymentPayload = {
      s3: deploymentCredentials.s3,
      timeout: config.timeout || values.DEFAULT_TIMEOUT_SECONDS,
      cors: cors ? await validateCors(cors) : false,
      handler: `${HANDLER}.${ENTRY_FUNCTION}`,
      routes: routes.map((routeConfig) => {
        routeConfig.module = path.posix.join(
          values.PROJECT_DIRECTORY,
          routeConfig.module,
        )
        return routeConfig
      }),
      scope,
      env,
      network: networkConfig,
      runtime: values.AWS_LAMBDA_RUNTIME,
      variables: envVars,
      memorySize: config.memorySize,
      scheduledFunctions: scheduledFunctions.map((scheduledFunction) => {
        const handlerFilePath = path.join(
          values.PROJECT_DIRECTORY,
          scheduledFunction.module,
        )
        const { name, dir } = path.parse(handlerFilePath)
        const handlerPath = path.join(dir, name)
        const handler = `${handlerPath}.${scheduledFunction.export}`
        return {
          ...scheduledFunction,
          timeout:
            scheduledFunction.timeout ||
            config.timeout ||
            values.DEFAULT_TIMEOUT_SECONDS,
          handler,
        }
      }),
    }

    await writeJsonFile(configPath, apiDeploymentPayload)

    spinner.succeed('Validation complete!')
    return [target, apiDeploymentPayload]
  } catch (error) {
    spinner.fail('Validation failed...')
    throw error
  }
}
