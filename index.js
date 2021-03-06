const appendFile = require('./append-file')
const composeFactory = require('./compose-factory')

const addLogStdout = (target = {}) => {
  const date = new Date().toLocaleString('ru')

  target.logStdout = (message, level = 'info') => {
    switch (level) {
      case 'info':
        console.info(`${date}. INFO. ${message}`)
        break
      case 'error':
        console.error(`${date}. ERROR. ${message}`)
        break
      default:
        throw new Error('No valid log level provided')
    }
  }

  return target
}

const addLogFile = (target = {}, { file = './.log' } = {}) => {
  const date = new Date().toLocaleString('ru')

  target.logFile = (message, level = 'info') => {
    switch (level) {
      case 'info':
        appendFile(file, `${date}. INFO. ${message}\n`)
        break
      case 'error':
        appendFile(file, `${date}. ERROR. ${message}\n`)
        break
      default:
        throw new Error('No valid log level provided')
    }
  }

  return target
}

const decorateLogger = (target = {}, { loggerProviders = ['logStdout'] }) => {
  target.decorate = function (func, { message, level }) {
    if (typeof func !== 'function') {
      throw new Error('No function provided')
    }

    return function (...args) {
      let count = 0

      loggerProviders.forEach(providerName => {
        if (target[providerName]) {
          count += 1
          target[providerName](message, level)
        }
      })

      if (count < 1) {
        throw new Error('Minimum one logger provider required')
      }

      return func(...args)
    }
  }

  return target
}

const createLogger = composeFactory(addLogStdout, addLogFile, decorateLogger)
const logger = createLogger({ file: './.log2', loggerProviders: ['logStdout', 'logFile'] })

function test (a, b) {
  return a + b
}

const loggingTest = logger.decorate(test, { message: 'Talk is cheap. Show me the code.', level: 'error' })

const result = loggingTest(1, 2)

console.log(result)
