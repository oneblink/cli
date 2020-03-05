module.exports = {
  debug: {
    type: 'boolean',
    default: false,
  },
  force: {
    type: 'boolean',
    default: false,
  },
  prune: {
    type: 'boolean',
    default: false,
  },
  skip: {
    type: 'boolean',
    default: true,
  },
  bucket: {
    type: 'string',
  },
  cwd: {
    type: 'string',
    default: process.cwd(),
  },
  env: {
    type: 'string',
    default: 'dev',
  },
}
