'use strict'

function inquirerMock(promptFn) {
  promptFn =
    promptFn ||
    (questions => {
      return Promise.resolve(
        questions.reduce((memo, question) => {
          memo[question.name] = question.name
          return memo
        }, {}),
      )
    })
  return {
    prompt: questions => promptFn(questions),
  }
}

module.exports = inquirerMock
