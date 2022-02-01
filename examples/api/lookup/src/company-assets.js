'use strict'

// require the OneBlink SDK
/* eslint-disable */
const OneBlink = require('@oneblink/sdk')

const warehouses = [
  {
    warehouseNumber: '1',
    assets: ['crane', 'forklift', 'hammer', 'drill'],
  },
  {
    warehouseNumber: '2',
    assets: ['lightsaber', 'pod-racer seat', 'hyper-drive'],
  },
]

module.exports.post = function (req, res) {
  // If the request does not contain the essential data to process,
  // finish early with a custom error message for the user to see.
  if (
    !req.body ||
    !req.body.submission ||
    !req.body.submission.warehouseNumber
  ) {
    // A user friendly error message can be shown to the user in One Blink Forms
    // by returning a 400 Status code and a JSON payload with a `message` property.
    // There is no character limit, however it is suggested to keep the message
    // short and clear.
    return res.setStatusCode(400).setPayload({
      message:
        'This is my custom friendly error message that will be shown to the user on a failed lookup',
    })
  }

  // Access the submission data from the request body.
  const warehouseNumber = req.body.submission.warehouseNumber
  const warehouse = warehouses.find(
    (warehouse) => warehouse.warehouseNumber === warehouseNumber,
  )

  // If the request does not contain a valid warehouse number,
  // finish early with a custom error message for the user to see.
  if (!warehouse) {
    return res.setStatusCode(400).setPayload({
      message: 'Could not find the warehouse you were looking for.',
    })
  }

  // Loop through all assets and create an element for each using the SDK.
  const elements = warehouse.assets.map((asset) => {
    return OneBlink.Forms.generateFormElement({
      name: asset,
      label: `Is the ${asset} present in the warehouse?`,
      type: 'radio',
      buttons: true,
      required: true,
      options: [
        {
          value: 'yes',
          label: 'Yes',
          colour: '#43a047', // green
        },
        {
          value: 'no',
          label: 'No',
          colour: '#f44336', // red
        },
      ],
    })
  })

  return res.setStatusCode(200).setPayload(elements)
}
