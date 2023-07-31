declare module '@blinkmobile/blinkmrc' {
  export type ConfigStore = {
    load: <T extends object>() => Promise<T>
    update: <T extends object>(updater: (t: T) => T) => Promise<T>
  }
  export function projectConfig(options: {
    name: string
    cwd: string
  }): ConfigStore
  export function userConfig(options: { name: string }): ConfigStore
}
