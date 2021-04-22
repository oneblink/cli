# Contributing

## Git Branch Workflow

This project adheres to [GitHub Flow](https://guides.github.com/introduction/flow/).

## Development

During development you will likely **not** wish to use the OneBlink Production Environment. This can be achieve by setting the `ONEBLINK_CLI_ENVIRONMENT` variable to the value of the environment you wish to use e.g. `test`.

## Release Process

1. Checkout `master`

   ```
   git checkout master
   ```

1. Get the latest code

   ```
   git pull
   ```

1. Start the release process

   ```
   npm run release
   ```
