module.exports.promisifyCallback = fn => (...args) => new Promise((res,rej) => {
  fn(...args, (err,data) => {
    err ? rej(err) : res(data)
  })
})

module.exports.doIfCondition = (condition, cond_fn) => new Promise((res,rej) => {
  condition ? Promise.resolve(cond_fn()).then(res) : res()
})