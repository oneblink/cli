import AWS from 'aws-sdk'

function s3Factory(bucketDetails: any, awsCredentials: any): Promise<any> {
  return Promise.resolve().then(
    () => new AWS.S3(Object.assign({}, awsCredentials, bucketDetails)),
  )
}

export default s3Factory
