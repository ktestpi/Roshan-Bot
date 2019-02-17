module.exports.promisifyCallback = fn => (...args) => new Promise((res,rej) => {
  fn(...args, (err,data) => {
    if(err){rej(err)}
    else(res(data))
  })
})

module.exports.doIfCondition = (condition, cond_fn) => new Promise((res,rej) => {
  condition ? Promise.resolve(cond_fn()).then(res) : res()
})