import read from './read.js'
export default async (cwd: string): Promise<void> => {
  const cfg = await read(cwd)
  if (cfg.scope) {
    console.log(`S3 Bucket name: ${cfg.scope}`)
  } else {
    console.log('S3 Bucket scope has not been set yet.')
  }
}
