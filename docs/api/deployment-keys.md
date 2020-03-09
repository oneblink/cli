# OneBlink API CLI

## Deployment Keys

Deployment keys can using to do deployments instead of using a specific users credentials.

You can obtain a deployment key pair, from the [OneBlink Console](https://console.oneblink.io). For more information, please contact [Support](https://support.oneblink.io).

### Usage

To use a deployment key pair, set the following environment variables before running `oneblink api deploy`:

- `ONEBLINK_ACCESS_KEY`
- `ONEBLINK_SECRET_KEY`

### Example

```
export ONEBLINK_ACCESS_KEY=123456abcdef
export ONEBLINK_SECRET_KEY=abcdefghijklmnopqrst0123456789abcdefghij
oneblink api deploy
```
