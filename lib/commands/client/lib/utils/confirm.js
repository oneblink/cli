/* @flow */
'use strict'

const inquirer = require('inquirer')

function confirm (
  force /* : boolean */,
  env /* : string */
) /* : Promise<boolean> */ {
  if (force) {
    return Promise.resolve(true)
  }
  const promptQuestions = [{
    type: 'confirm',
    name: 'confirmation',
    message: `Are you sure you want to deploy to environment "${env}": [Y]`
  }]
  return inquirer.prompt(promptQuestions)
    .then(results => results.confirmation)
}

module.exports = confirm
