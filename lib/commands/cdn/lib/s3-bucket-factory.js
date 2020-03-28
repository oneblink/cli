/* @flow */
'use strict'

const AWS = require('aws-sdk')

function s3Factory(
  bucketDetails /* : Object */,
  awsCredentials /* : Object */,
) /* : Promise<Object> */ {
  return Promise.resolve().then(
    () => new AWS.S3(Object.assign({}, awsCredentials, bucketDetails)),
  )
}

module.exports = s3Factory
