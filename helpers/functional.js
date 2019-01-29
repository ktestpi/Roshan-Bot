module.exports.promisifyCallback = fn => (...args) => new Promise((res,rej) => {
  fn(...args, (err,data) => {
    if(err){rej(err)}
    else(res(data))
  })
})