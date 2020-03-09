# OneBlink CLI | Documentation

## Logging In

The OneBlink CLI tools require users to be authenticated before use.
The `login` command will allow user to authenticate themselves with OneBlink via a variety of login providers

`oneblink login` Start a browser based login process.

- `--username <username>` Start a username and password login process. Omitting <username> will prompt for username.
- `--password <password>` Specify password instead of being prompted.

To start a browser based login process (this will allow you to login using a social account e.g. Google):

```sh
oneblink login
```

To start a username and password login process and be prompted for password:

```sh
oneblink login --username username@email.com
```
