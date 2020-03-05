'use strict'

const companies = [
  {
    ABN: '1',
    companyName: 'Bobs burgers'
  },
  {
    ABN: '2',
    companyName: 'Roberts burgers'
  }
]

module.exports.post = function (req, res) {
  // If the request does not contain the essential data to process,
  // finish early with a custom error message for the user to see.
  if (
    !req.body ||
    !req.body.submission ||
    !req.body.submission.abn
  ) {
    // A user friendly error message can be shown to the user in One Blink Forms
    // by returning a 400 Status code and a JSON payload with a `message` property.
    // There is no character limit, however it is suggested to keep the message
    // short and clear.
    return res
      .setStatusCode(400)
      .setPayload({
        message: 'This is my custom friendly error message that will be shown to the user on a failed lookup'
      })
  }

  // access the submission data from the request body
  const abn = req.body.submission.abn
  const details = companies.find(company => company.ABN === abn)
  if (details) {
    // set the response code and set body as form pre-fill data using 'element name': 'value'
    return res
      .setStatusCode(200)
      .setPayload({
        Company_name: details.companyName
      })
  }

  return res
    .setStatusCode(400)
    .setPayload({
      message: 'Could not find the company you were looking for.'
    })
}
