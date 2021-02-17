import { URLSearchParams } from 'url'

import querystring from 'querystring'
import crypto from 'crypto'
import fetch from 'node-fetch'
import inquirer from 'inquirer'
import open from 'open'
import base64url from 'base64url'

import constants from '../constants'
import LoginProviderBase from './login-provider-base'

export default class BrowserLoginProvider extends LoginProviderBase {
  async login(storeJwt: boolean | undefined): Promise<string> {
    // Generate the verifier, and the corresponding challenge
    const verifier = base64url.encode(crypto.randomBytes(32))
    const verifierChallenge = base64url.encode(
      crypto.createHash('sha256').update(verifier).digest(),
    )
    const qs = querystring.stringify({
      response_type: 'code',
      scope: constants.SCOPE,
      client_id: this.CONSTANTS.loginClientId,
      redirect_uri: this.CONSTANTS.loginCallbackUrl,
      code_challenge: verifierChallenge,
      code_challenge_method: 'S256',
    })
    // Open a browser and initiate the authentication process with Auth0
    // The callback URL is a simple website that simply displays the OAuth2 authz code
    // User will copy the value and then paste it here for the process to complete.
    open(`${this.CONSTANTS.loginUrl}/authorize?${qs}`, { wait: false })

    console.log(
      'A browser has been opened to allow you to login. Once logged in, you will be granted a verification code.',
    )

    const questions = [
      {
        type: 'input',
        name: 'code',
        message: 'Please enter the code: ',
      },
    ]

    const results = await inquirer.prompt(questions)

    const params = new URLSearchParams()
    params.append('code', results.code)
    params.append('code_verifier', verifier)
    params.append('client_id', this.CONSTANTS.loginClientId)
    params.append('grant_type', 'authorization_code')
    params.append('redirect_uri', this.CONSTANTS.loginCallbackUrl)

    const response = await fetch(this.CONSTANTS.loginUrl + '/oauth2/token', {
      method: 'POST',
      body: params,
    })

    const body = await response.json()
    if (!response.ok) {
      throw new Error(
        body.error_description ||
          'Unknown error, please try again and contact support if the problem persists',
      )
    }

    if (storeJwt) {
      await this.storeJWT(body)
    }

    return body.id_token
  }
}
