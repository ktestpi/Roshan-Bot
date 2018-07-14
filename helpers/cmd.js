const util = require('erisjs-utils')
const lang = require('../lang.json')

let self = module.exports

const check = {
  isBetatester : function(msg,args,cmd){
    const result = this.cache.betatesters.has(msg.author.id)
    if(!result){msg.reply('Es una función para Betatesters')}
    return result
  },
  isSupporter : function(msg,args,cmd){
    const result = this.cache.supporters.has(msg.author.id)
    if(!result){msg.reply('Es una función para Supporters')}
    return result
  }
}

module.exports = {
  check
}
