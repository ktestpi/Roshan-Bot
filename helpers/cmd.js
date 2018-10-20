const check = {
  isBetatester : function(msg,args,cmd){
    const result = this.cache.betatesters.has(msg.author.id)
    if(!result){msg.reply(this.local.getUserString('denyUseNotBetatester',msg))}
    return result
  },
  isSupporter : function(msg,args,cmd){
    const result = this.cache.supporters.has(msg.author.id)
    if(!result){msg.reply(this.local.getUserString('denyUseNotSupporter',msg))}
    return result
  }
}

module.exports = {
  check
}
