# OneBlink API CLI

## Network Configuration

Network configuration will allow your [handlers](./handlers.md) to run in your own networks based on the environment.

#### .blinkmrc.json

Network configuration is scoped to a specific environment. If an environment is not specified in the `.blinkmrc.json` file, it will not be applied during deployment.

```json
{
  "server": {
    "network": {
      "dev": {
        "vpcSubnets": ["subnet-dev1", "subnet-dev2", "subnet-dev3"],
        "vpcSecurityGroups": ["sg-dev"]
      },
      "prod": {
        "vpcSubnets": ["subnet-prod1", "subnet-prod2", "subnet-prod3"],
        "vpcSecurityGroups": ["sg-prod"]
      }
    }
  }
}
```

The configuration used will depend on the value of `--env` flag used during `bm server deploy`
