import { URLSearchParams, URL } from 'url'

import crypto from 'crypto'
import fetch from 'node-fetch'
import inquirer from 'inquirer'
import open from 'open'
import base64url from 'base64url'

import constants from '../constants.js'
import LoginProviderBase from './login-provider-base.js'

export default class BrowserLoginProvider extends LoginProviderBase {
  async login(storeJwt: boolean | undefined): Promise<string> {
    // Generate the verifier, and the corresponding challenge
    // @ts-expect-error ???
    const verifier = base64url.encode(crypto.randomBytes(32))
    // @ts-expect-error ???
    const verifierChallenge = base64url.encode(
      crypto.createHash('sha256').update(verifier).digest(),
    )
    const authorizeUrl = new URL('/oauth2/authorize', this.CONSTANTS.loginUrl)
    authorizeUrl.searchParams.append('response_type', 'code')
    authorizeUrl.searchParams.append('scope', constants.SCOPE)
    authorizeUrl.searchParams.append('client_id', this.CONSTANTS.loginClientId)
    authorizeUrl.searchParams.append(
      'redirect_uri',
      this.CONSTANTS.loginCallbackUrl,
    )
    authorizeUrl.searchParams.append('code_challenge', verifierChallenge)
    authorizeUrl.searchParams.append('code_challenge_method', 'S256')
    // Open a browser and initiate the authentication process with Auth0
    // The callback URL is a simple website that simply displays the OAuth2 authz code
    // User will copy the value and then paste it here for the process to complete.
    open(authorizeUrl.href, { wait: false })

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

    const tokenUrl = new URL('/oauth2/token', this.CONSTANTS.loginUrl)
    const response = await fetch(tokenUrl.href, {
      method: 'POST',
      body: params,
    })

    const body = (await response.json()) as {
      id_token: string
      access_token: string
      refresh_token: string
    }
    if (!response.ok) {
      throw new Error(
        (body as { error_description?: string }).error_description ||
          'Unknown error, please try again and contact support if the problem persists',
      )
    }

    if (storeJwt) {
      await this.storeJWT(body)
    }

    return body.id_token
  }
}
