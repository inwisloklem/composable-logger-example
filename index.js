const appendFile = require('./append-file')
const composeFactory = require('./compose-factory')

const addLogStdout = (target = {}) => {
  const date = new Date().toLocaleString()

  target.logStdout = (message, level = 'info') => {
    switch (level) {
      case 'info':
        console.info(`INFO. ${date}. ${message}`)
        break
      case 'error':
        console.error(`ERROR. ${date}. ${message}`)
        break
      default:
        throw new Error('No valid log level provided')
    }
  }

  return target
}

const addLogFile = (target = {}, { file = './.log' } = {}) => {
  const date = new Date().toLocaleString()

  target.logFile = (message, level = 'info') => {
    switch (level) {
      case 'info':
        appendFile(file, `INFO. ${date}. ${message}\n`)
        break
      case 'error':
        appendFile(file, `ERROR. ${date}. ${message}\n`)
        break
      default:
        throw new Error('No valid log level provided')
    }
  }

  return target
}

const decorateLogger = (target = {}) => {
  target.decorate = function (func, { message, level }) {
    if (typeof func !== 'function') {
      throw new Error('No function provided')
    }

    return function () {
      Object.keys(target)
        .forEach(k => k.includes('log') ? target[k](message, level) : null)

      return func()
    }
  }

  return target
}

const createLogger = composeFactory(addLogStdout, addLogFile, decorateLogger)
const logger = createLogger({ file: './.log2' })

function test () {}
const loggingTest = logger.decorate(test, { message: 'Talk is cheap. Show me the code.', level: 'error' })

loggingTest()
