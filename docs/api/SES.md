# OneBlink API CLI

## Sending Emails via AWS SES

API Hosting Service provides the ability to send emails via AWS's Simple Email Service(SES)

### How to use

1.  Add the AWS SDK(aws-sdk) as a dependency to your project

1.  Require in the AWS module

    ```js
    const AWS = require('aws-sdk')
    ```

1.  Instantiate the SES class, with the region set to 'us-east-2'

    ```js
    const ses = new AWS.SES({ region: 'us-east-2' })
    ```

1.  Use the sendEmail or sendRawEmail functions to send emails, see the [AWS SES docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html) for further details
