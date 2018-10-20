const fs = require('fs')
const pathLocale = __dirname.split('\\').reverse().slice(1).reverse().join('\\') + '/locale'

let locale = {}
fs.readdirSync(pathLocale).forEach(file => {
  locale[file.split('.')[0]] = require(pathLocale + '/' + file)
})

module.exports.locale = locale

module.exports.cmdLocalString = function(cmd){
  let local = {}
  for (let lang in locale) {
    local[lang] = {args : locale[lang][`cmd_${cmd}_args`] || '', help : locale[lang][`cmd_${cmd}_args`] || ''}
  }
  console.log(local);
  return local
}
