// flow-typed signature: 3411e7e4b2918f17c681007e4da1de33
// flow-typed version: c6154227d1/pify_v3.x.x/flow_>=v0.104.x

type $npm$pify$CPSFunction = (...args: any[]) => any;

type $npm$pify$Options = {
  multiArgs?: boolean,
  include?: Array<string | RegExp>,
  exclude?: Array<string | RegExp>,
  excludeMain?: boolean,
  errorFirst?: boolean,
  promiseModule?: () => any,
  ...
};

type $npm$pify$PromisifiedFunction = (...args: any[]) => Promise<*>;

declare module "pify" {
  declare module.exports: (
    input: $npm$pify$CPSFunction | Object,
    options?: $npm$pify$Options
  ) => (...args: any[]) => Promise<*> | Object;
}
