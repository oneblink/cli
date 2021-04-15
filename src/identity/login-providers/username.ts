import AWS from 'aws-sdk'
import inquirer from 'inquirer'

import LoginProviderBase from './login-provider-base'

export default class UsernameLoginProvider extends LoginProviderBase {
  async login(
    username: string | null,
    password: string | void,
    storeJwt: boolean | undefined,
  ): Promise<string> {
    const results = await this._getCredentials(username, password)
    if (!results.username) {
      return Promise.reject(new Error('Please specify a username.'))
    }
    if (!results.password) {
      return Promise.reject(new Error('Please specify a password.'))
    }

    return this._requestJWT(results.username, results.password, storeJwt)
  }

  async _getCredentials(
    username: string | null,
    password: string | void,
  ): Promise<{ username: string; password: string }> {
    if (username && password) {
      return Promise.resolve({
        username,
        password,
      })
    }

    const questions = []
    if (!username) {
      questions.push({
        type: 'input',
        name: 'username',
        message: 'OneBlink Username: ',
      })
    }
    if (!password) {
      questions.push({
        type: 'password',
        name: 'password',
        message: 'OneBlink Password: ',
      })
    }
    const results = await inquirer.prompt(questions)
    results.username = results.username || username
    results.password = results.password || password
    return results
  }

  async _requestJWT(
    username: string,
    password: string,
    storeJwt: boolean | undefined,
  ): Promise<string> {
    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider(
      {
        region: this.CONSTANTS.region,
      },
    )

    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.CONSTANTS.loginClientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    }
    const {
      AuthenticationResult,
    } = await cognitoIdentityServiceProvider.initiateAuth(params).promise()
    if (
      !AuthenticationResult ||
      !AuthenticationResult.IdToken ||
      !AuthenticationResult.AccessToken ||
      !AuthenticationResult.RefreshToken
    ) {
      throw new Error(
        'cognitoIdentityServiceProvider.initiateAuth() did not return a valid AuthenticationResult',
      )
    }

    if (storeJwt) {
      await this.storeJWT({
        id_token: AuthenticationResult.IdToken,
        access_token: AuthenticationResult.AccessToken,
        refresh_token: AuthenticationResult.RefreshToken,
      })
    }

    return AuthenticationResult.IdToken
  }
}
