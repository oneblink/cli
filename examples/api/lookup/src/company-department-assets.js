'use strict'

// require the OneBlink SDK
const { v4: uuidV4 } = require('uuid')
const OneBlink = require('@oneblink/sdk')

const allDepartments = [
  {
    type: 'real',
    name: 'Construction',
    assets: ['Crane', 'Forklift', 'Hammer', 'Drill'],
  },
  {
    type: 'real',
    name: 'Hospital',
    assets: [
      'Lab Coat',
      'Thing around the neck to listen to heart',
      'MRI Machine',
      'Chefs Hat (?!?)',
    ],
  },
  {
    type: 'fake',
    name: 'Star Wars',
    assets: ['Light Saber', 'Pod-racer Seat', 'Hyper-drive'],
  },
  {
    type: 'fake',
    name: 'Star Trek',
    assets: ['Teleporter', 'Stun Gun', 'Space Suit'],
  },
]

module.exports.post = function (req, res) {
  // If the request does not contain the essential data to process,
  // finish early with a custom error message for the user to see.
  if (!req.body || !req.body.submission || !req.body.submission.type) {
    // A user friendly error message can be shown to the user in One Blink Forms
    // by returning a 400 Status code and a JSON payload with a `message` property.
    // There is no character limit, however it is suggested to keep the message
    // short and clear.
    res.setStatusCode(400)
    return {
      message:
        'This is my custom friendly error message that will be shown to the user on a failed lookup',
    }
  }

  // Access the submission data from the request body.
  const type = req.body.submission.type
  const departments = allDepartments.filter(
    (department) => department.type === type,
  )

  // If the request does not contain a valid warehouse number,
  // finish early with a custom error message for the user to see.
  if (!departments.length) {
    res.setStatusCode(400)
    return {
      message: 'Could not find the type of departments you were looking for.',
    }
  }

  // Loop through all assets and create a page element for each department and elements for each asset using the SDK.
  const pageElements = departments.map((department) => ({
    id: uuidV4(),
    type: 'page',
    label: department.name,
    elements: department.assets.map((asset) => {
      return OneBlink.Forms.generateFormElement({
        name: asset,
        label: `Is the ${asset} present in the department?`,
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
    }),
  }))

  return pageElements
}
