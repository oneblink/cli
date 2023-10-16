import write from '../write.js'
import show from '../show.js'

export default async function (
  tenant: Tenant,
  input: Array<string>,
  flags: any,
): Promise<void> {
  const bucket = flags.bucket || input[0]
  if (bucket) await write(flags.cwd, bucket)

  await show(flags.cwd)
}
