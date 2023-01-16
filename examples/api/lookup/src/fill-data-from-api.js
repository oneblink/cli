const fetch = require('node-fetch')
const formsApp = require('@oneblink/sdk/tenants/oneblink')

module.exports.post = async function (req, res) {
  if (!req.body || !req.body.submission || !req.body.submission.Activity_Type) {
    return res.setStatusCode(400).setPayload({
      message: 'Error, you did not select any names',
    })
  }

  console.log(req)

  const activityType = req.body.submission.Activity_Type

  const response = await fetch(
    `https://www.boredapi.com/api/activity?type=${activityType}`,
    {
      method: 'GET',
    },
  )

  //Returns a json object.
  const activityReturned = await response.json()
  console.log('Activity returned', activityReturned)
  /*json object that is returned from above
  {
    activity: string,
    type: string,
    participants: number,
    price: number,
    link: string,
    key: string,
    accessibility: number,
  }
  */
  if (!activityReturned) {
    return res.setStatusCode(400).setPayload({
      message: 'Error, nothing returned from the API.',
    })
  }

  return res.setStatusCode(200).setPayload({
    activity: activityReturned.activity,
    participants: activityReturned.participants,
    price: activityReturned.price,
    link: activityReturned.link,
    key: activityReturned.key,
    accessibility: activityReturned.accessibility,
  })
}
