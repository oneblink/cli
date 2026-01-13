# OneBlink CLI | Documentation

## Requirements

- [Node.js](https://nodejs.org/) 22.0 or newer
- NPM 10.0 or newer

## Installation

```sh
npm install -g @oneblink/cli
```

## Tenants

This CLI is the entry point for all OneBlink Productivity tenants. The tenant used by the CLI is determined by the entry point command. The available tenants are:

- [OneBlink Console (AU)](https://console.oneblink.io)

  ```sh
  oneblink --help
  ```

- [OneBlink Console (US)](https://console.us.oneblink.io)

  ```sh
  oneblink-us --help
  ```

- [CivicOptimize Productivity](https://console.transform.civicplus.com)

  ```sh
  civicplus --help
  ```

All command documentation below applies to all tenants. However, all of the examples use the `oneblink` tenant.

## Usage

Run the following command for usage information

```sh
oneblink --help
```

Or you can read more detailed documentation on each command:

- [Login Command](./login.md)

- [API CLI](./api/README.md)

- [CDN CLI](./cdn/README.md)

- [Logout Command](./logout.md)
