import { z } from 'zod'

const bodySchema = z.object({
  submission: z.object({
    name: z.string(),
    age: z.number().optional(),
    email: z.string().email()
  })
})

function post(req, res) {

  // Custom submission validation. You can use any validation library (or not) that you like to validate your data.
  try {
    const { submission } = bodySchema.parse(req.body)

    // Validation passed, return 200 to proceed with form submission
    return res.setStatusCode(200)
  }
  if (error) {
    // A user friendly error message can be shown to the user in One Blink Forms
    // by returning a 400 Status code and a JSON payload with a `message` property.
    // There is no character limit, however it is suggested to keep the message
    // short and clear.
    return res
      .setStatusCode(400)
      .setPayload({
        message: 'This is my custom friendly error message that will be shown to the user on failed validation'
      })
  }


}

export { post }
