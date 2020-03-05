# OneBlink API CLI

## Logging

Your Handlers can contain logging statements. The following Node.js statements generate log entries:

- `console.log()`
- `console.info()`
- `console.warn()`
- `console.error()`

### Server Logs

Once your project has been deployed you can view the server logs using the following command:

```bash
oneblink api logs
```

**Note:** There's a small lag between invoking the function and actually having the log event registered. So it takes a few seconds for the logs to show up right after invoking the function.

#### Options

- `--env`: The environment you want to view the logs for, defaults to `dev`
- `--filter`: You can specify a filter string to filter the log output. This is useful if you want to to get the `error` logs for example. See [AWS - Filter and Pattern Syntax](http://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html) for more advanced use of this flag.
- `--tail`: You can optionally tail the logs and keep listening for new logs in your terminal session by passing this option.
- `--start-time`: A specific unit in time to start fetching logs from (ie: `2010-10-20` or `1469705761`). Here's a list of the supported string formats:

```bash
30m                   # since 30 minutes ago
2h                    # since 2 hours ago
3d                    # since 3 days ago

2013-02-08            # A calendar date part
2013-W06-5            # A week date part
2013-039              # An ordinal date part

20130208              # Basic (short) full date
2013W065              # Basic (short) week, weekday
2013W06               # Basic (short) week only
2013050               # Basic (short) ordinal date

2013-02-08T09         # An hour time part separated by a T
20130208T080910,123   # Short date and time up to ms, separated by comma
20130208T080910.123   # Short date and time up to ms
20130208T080910       # Short date and time up to seconds
20130208T0809         # Short date and time up to minutes
20130208T08           # Short date and time, hours only
```

#### Examples

- View the logs that happened in the past 5 hours:

  ```bash
  oneblink api logs --start-time 5h
  ```

- View the logs that happened starting at epoch `1469694264`:

  ```bash
  oneblink api logs --start-time 1469694264
  ```

- Logs will be polled and the output will be logged to your terminal:

  ```bash
  oneblink api logs --tail
  ```

  **Note**: Requires a `CTRL + C` to stop the polling.

- View only the logs that contain the string `CustomError`:

  ```bash
  oneblink api logs --filter CustomError
  ```
