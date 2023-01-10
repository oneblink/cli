import fetch from 'node-fetch'

export default async function (req, res) {
  if (!req.body || !req.body.submission || !req.body.submission.Full_Name) {
    return res.setStatusCode(400).setPayload({
      message: 'Error, you did not select any names',
    })
  }

  const name = req.body.submission.Full_Name

  const response = await fetch(
    `https://mockyard.herokuapp.com/users/name/${name}`,
    {
      method: 'GET',
    },
  )

  //Returns an array of objects, we will grab the first.
  const person = (await response.json())[0]
  console.log('Person before', person)
  /*json object that is returned from above
  {
    id: number,
    name: string,
    email: string,
    gender: string,
    image: string,
    phone: stirng,
    country: string,
    city: string, 
    age: number
  }
  */
  if (!person) {
    return res.setStatusCode(400).setPayload({
      message: 'Error, nothing returned from the API',
    })
  }
  console.log('Person returned', person)
  return res.setStatusCode(200).setPayload({
    id: person.id,
    email: person.email,
    gender: person.gender,
    phone: person.phone,
    country: person.country,
    city: person.city,
    age: +person.age,
  })
}
