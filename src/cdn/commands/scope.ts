import write from '../write'
import show from '../show'

export default async function (
  input: Array<string>,
  flags: any,
): Promise<void> {
  const bucket = flags.bucket || input[0]
  if (bucket) await write(flags.cwd, bucket)

  return show(flags.cwd)
}
