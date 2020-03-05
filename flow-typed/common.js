/* @flow */

/* ::
declare type Tenant = {
  id: 'ONEBLINK' | 'CIVICPLUS',
  command: string,
  label: string,
  origin: string,
  apiHostingBucket: string,
  region: string,
}

declare class BlinkMobileIdentity {
  constructor('ONEBLINK' | 'CIVICPLUS'): void,
  login(?{ username?: string | boolean, password?: string, storeJwt?: boolean }): Promise<void>,
  logout(): Promise<void>,
  getAccessToken(): Promise<string>,
  getPayload(string | void): Promise<Object>
}

declare type CLICommand = (Tenant, inputs: string[], BlinkMobileIdentity) => Promise<void>
*/
