import inquirer from 'inquirer'

function confirm(force: boolean, env: string): Promise<boolean> {
  if (force) {
    return Promise.resolve(true)
  }
  return inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'confirmation',
        message: `Are you sure you want to deploy to environment "${env}": [Y]`,
      },
    ])
    .then((results) => results.confirmation)
}

export default confirm
