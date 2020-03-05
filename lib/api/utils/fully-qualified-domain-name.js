/* @flow */
'use strict'

function getFQDN (
  project /* : string */,
  env /* : string */
) /* : string */ {
  if (env.toLowerCase() === 'prod') {
    return project
  }
  const arr = project.split('.')
  arr[0] += `-${env}`
  return arr.join('.')
}

function getDomain (
  project /* : string */
) /* : string */ {
  const arr = project.split('.')
  arr.shift()
  return arr.join('.')
}

function getSubDomain (
  project /* : string */
) /* : string */ {
  const arr = project.split('.')
  return arr[0]
}

module.exports = {
  getFQDN,
  getDomain,
  getSubDomain
}
