import read from './read'
export default async (cwd: string): Promise<void> => {
  const cfg = await read(cwd)
  cfg.scope
    ? console.log(`S3 Bucket name: ${cfg.scope}`)
    : console.log('S3 Bucket scope has not been set yet.')
}
