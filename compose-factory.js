const composeFactory = (...fns) => {
  return function factory (...args) {
    let instance = {}

    fns.forEach(fn => {
      instance = fn(instance, ...args)
    })

    return instance
  }
}

module.exports = composeFactory
