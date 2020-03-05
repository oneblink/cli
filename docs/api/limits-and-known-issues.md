# OneBlink API CLI

## Deployment Limitations

- One deployment for a certain project should be in-progress at any one time

  - There are no safeguards against this yet, we may add safeguards in beta

- Deployments for projects that contain more than 40 routes might fail

  - There are no safeguards against this yet, we may add safeguards in beta

- Not compatible with private modules

  - Everything in node_modules MUST have come from the public NPM registry

  - Your package.json MUST specify everything in node_modules

## Known Issues

- Before transitioning to beta, we will wipe configuration / code in the alpha test environment

- Project URLs are not branded, and are raw AWS resource URLs

  - We will use friendlier, branded URLs in beta

- Documentation is not necessarily complete

  - Consider the API to be unstable, it may change before beta

  - We are open to changing the API based on your feedback
