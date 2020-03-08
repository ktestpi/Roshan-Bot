module.exports.promisifyCallback = fn => (...args) => new Promise((res,rej) => {
  fn(...args, (err,data) => {
    err ? rej(err) : res(data)
  })
})

module.exports.doIfCondition = (validate, cond_fn) => new Promise((res,rej) => {
  validate ? Promise.resolve(cond_fn()).then(res) : res()
})