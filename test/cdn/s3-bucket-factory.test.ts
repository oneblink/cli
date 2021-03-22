import s3Factory from '../../src/commands/cdn/lib/s3-bucket-factory'

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
