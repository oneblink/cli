# OneBlink API CLI

## Memory Constraints

By default Memory for your api is limited to 1024 MB (1 GB).

### Increasing Memory Size

We allow for increasing the Memory Size of your api through the `server.memorySize` property in the `.blinkmrc.json` file. CPU allocation is tied to Memory Size;

#### .blinkmrc.json

The following configuration will allow 2GB for your api functions:

```json
{
  "server": {
    "memorySize": 2048
  }
}
```
