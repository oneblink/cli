# OneBlink API CLI

## Local Development

Once you have written your handlers and setup the required routes, you are able to serve you code locally using the CLI `serve` command.

### `serve` Command

```bash
oneblink api serve
```

#### Options

- `--env`: optionally sets the environment to load environment variables from, defaults to `dev`. See [Environment Variables](./environment-variables.md) for more information.
- `--port`: optionally sets the port to use for server, defaults to `3000`.
- `--cwd`: optionally set the path to project, defaults to current working directory.

#### Examples

- Serve routes and handlers using `test` environment variables on port `2000`:

  ```bash
  oneblink api serve --env test --port 2000
  ```

### BYO AWS Credentials

When running the OneBlink API CLI `serve` command, AWS Credentials are retrieved and used to allow you to communicate with AWS with limited restrictions. If you require access to more AWS services than the defaults, OneBlink are able to provide you with AWS credentials that you can use during local development to mirror your deployed AWS privileges.

#### Configuration

The property `awsProfile` can be added to your projects `.blinkmrc.json` file, which will be use as [`AWS_PROFILE`](https://docs.aws.amazon.com/cli/latest/userguide/cli-environment.html) variable **only during local development**.

```json
{
  "server": {
    "awsProfile": "name-of-profile"
  }
}
```

Follow these steps to setup an AWS Profile

1.  Contact OneBlink for AWS credentials for development purposes. Ensure you notify us of any specific privileges you believe you may need.

1.  Install the AWS CLI

    - [Windows](https://docs.aws.amazon.com/cli/latest/userguide/awscli-install-windows.html)
    - [Mac](https://docs.aws.amazon.com/cli/latest/userguide/cli-install-macos.html) (We recommend installing with `brew`)
      ```
      brew install awscli
      ```

1.  Create an [AWS Profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html)

1.  Manually update your `.blinkmrc.json` file with the `awsProfile` property
