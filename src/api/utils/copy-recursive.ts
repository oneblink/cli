import copy from 'recursive-copy'

const CPR_OPTIONS = {
  overwrite: true,
  dot: true,
}

export default async function copyRecursive(
  source: string,
  target: string,
): Promise<void> {
  // @ts-expect-error ???
  await copy(source, target, CPR_OPTIONS)
}
