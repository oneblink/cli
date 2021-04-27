# OneBlink API CLI

## Execution Environment

- Code executes within a Linux environment with [Node.js 14](https://nodejs.org/dist/latest-v14.x/docs/api/)

  - If you use features not available in this version of Node.js, transpile before deployment. NPM packages using native binaries can be installed using docker:

  ```
  docker run -it --rm -v ${PWD}:/app -w /app node:14 npm install
  ```

* The environment your code executes in is arbitrarily destroyed between requests

  - You may store files in the file-system, but do not rely on them between requests

  - You may store values in global variables, but do not rely on them between requests

- There is no built-in persistent storage for sessions, cookies, or other data

  - You may use database drivers from NPM to connect to databases

    - E.g. the AWS RDS MySQL databases that we’ve provisioned for you

    - See: [sequelize](https://github.com/sequelize/sequelize), [node-mongodb-native](https://github.com/mongodb/node-mongodb-native)

  - You may use SDKs for AWS, Dropbox, Google, etc to persist data

    - E.g. any AWS S3 buckets that we’ve provisioned for you

    - See: [aws-sdk](https://github.com/aws/aws-sdk-js), [dropbox](https://github.com/dropbox/dropbox-sdk-js/), [googleapis](https://github.com/google/google-api-nodejs-client)

- Customers with firewalls will be able to use CIDR whitelists as in BMP
