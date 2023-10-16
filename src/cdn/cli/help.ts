import chalk from 'chalk'

export default (tenant: Tenant): string => `
${chalk.bold(`${tenant.label} CDN Command`)}

${chalk.blue('scope <domain>')} ${chalk.grey(
  '......',
)} Create a new project by passing the CDN Hosting identifier
  ${chalk.blue('--cwd')} ${chalk.grey(
    '.............',
  )} Optionally set the project path, defaults to the current working directory

${chalk.blue('deploy')} ${chalk.grey('..............')} Deploy the project
  ${chalk.blue('<path>')} ${chalk.grey(
    '............',
  )} Upload files in ${chalk.blue('<path>')} (relative to the ${chalk.blue(
    '--cwd',
  )} flag)
  ${chalk.blue('--force')} ${chalk.grey(
    '...........',
  )} Force deployment without confirmation
  ${chalk.blue('--env')} ${chalk.grey(
    '.............',
  )} Deploy a specific environment, defaults to 'dev'
  ${chalk.blue('--prune')} ${chalk.grey(
    '...........',
  )} Remove files that do not exist locally but do exist in the ${
    tenant.label
  } CDN
  ${chalk.blue('--cwd')} ${chalk.grey(
    '.............',
  )} Optionally set the project path, defaults to the current working directory

${chalk.blue('teardown')} ${chalk.grey(
  '............',
)} Teardown an environment for the project
  ${chalk.blue('--force')} ${chalk.grey(
    '...........',
  )} Force teardown without confirmation
  ${chalk.blue('--env')} ${chalk.grey(
    '.............',
  )} Teardown a specific environment, defaults to 'dev'
  ${chalk.blue('--cwd')} ${chalk.grey(
    '.............',
  )} Optionally set the project path, defaults to the current working directory

${chalk.bold('Examples')}

  ${chalk.blue(`${tenant.command} cdn scope project.cdn.oneblink.io`)}
  ${chalk.blue(
    `${tenant.command} cdn deploy ./path/to/assets --env dev --force --prune`,
  )}
  ${chalk.blue(`${tenant.command} cdn teardown --env dev --force`)}`
