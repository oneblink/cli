'use strict'

module.exports.get = function () {
  const stateLabel = 'State'
  const countryLabel = 'Country'

  return [
    {
      value: 'SYD',
      label: 'Sydney',
      attributes: [
        {
          label: stateLabel,
          value: 'NSW',
        },
        {
          label: countryLabel,
          value: 'AUS',
        },
      ],
    },
    {
      value: 'ATL',
      label: 'Atlanta',
      attributes: [
        {
          label: stateLabel,
          value: 'GA',
        },
        {
          label: countryLabel,
          value: 'USA',
        },
      ],
    },
    {
      value: 'PEK',
      label: 'Beijing',
      attributes: [
        {
          label: stateLabel,
          value: 'Chaoyang-Shunyi',
        },
        {
          label: countryLabel,
          value: 'CHN',
        },
      ],
    },
    {
      value: 'DXB',
      label: 'Garhoud',
      attributes: [
        {
          label: countryLabel,
          value: 'UAE',
        },
      ],
    },
    {
      value: 'LAX',
      label: 'Los Angeles',
      attributes: [
        {
          label: stateLabel,
          value: 'CA',
        },
        {
          label: countryLabel,
          value: 'USA',
        },
      ],
    },
    {
      value: 'MEL',
      label: 'Melbourne',
      attributes: [
        {
          label: stateLabel,
          value: 'VIC',
        },
        {
          label: countryLabel,
          value: 'AUS',
        },
      ],
    },
    {
      value: 'BNE',
      label: 'Brisbane',
      attributes: [
        {
          label: stateLabel,
          value: 'QLD',
        },
        {
          label: countryLabel,
          value: 'AUS',
        },
      ],
    },
  ]
}
