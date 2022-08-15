import { expect, test } from '@jest/globals'

import s3Factory from '../../src/cdn/s3-bucket-factory.js'

test('it should have the bucket name pre-configured', async () => {
  const params = {
    region: 'region',
    params: {
      Bucket: 'a',
      Expires: 60,
      ACL: 'public-read',
    },
  }

  const s3 = await s3Factory(params, {
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: '',
  })

  expect(s3.config.params.Bucket).toBe(params.params.Bucket)
})
