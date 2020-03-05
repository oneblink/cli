# OneBlink CDN CLI

## Deployment Keys

Deployment keys can using to do deployments instead of using a specific users credentials.

To obtain a deployment key pair, please contact your BlinkM administrator(s)

### Usage

To use a deployment key pair, sett the following environment variables before running `oneblink cdn deploy`:

- `BLINKM_ACCESS_KEY`
- `BLINKM_SECRET_KEY`

### Example

```
export BLINKM_ACCESS_KEY=123456abcdef
export BLINKM_ACCESS_KEY=abcdefghijklmnopqrst0123456789abcdefghij
oneblink cdn deploy
```
