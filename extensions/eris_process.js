const Aghanim = require('aghanim')
const { Extension } = require('aghanim')

module.exports = new Extension('my-eris-extensions',function(bot,Eris){
  Eris.Guild.prototype.membersWithRole = function(roleName){
    const role = this.roles.find(r => r.name === roleName)
    return role ? this.members.filter(m => m.roles.includes(role.id)) : []
  }
  // Eris.Message.prototype.reply = function(content,file){
  // 	return this.channel.createMessage(content,file)
  // }
  //
  // Eris.Message.prototype.replyDM = function(content,file){
  //   return this.author.getDMChannel().then(channel => channel.createMessage(content,file))
  // }

  Eris.Message.prototype.replyError = function(content,file){
    if(typeof content === 'string'){content = ':x: ' + content}
  	return this.channel.createMessage(content,file)
  }

  Eris.Message.prototype.addReactionSuccess = function(){
    return this.addReaction(this._client.config.emojis.default.accept)
  }

  Eris.Message.prototype.addReactionFail = function(){
    return this.addReaction(this._client.config.emojis.default.error)
  }

  Eris.Message.prototype.addReactionSending = function(){
    return this.addReaction(this._client.config.emojis.default.envelopeIncoming)
  }

  // String.prototype.replaceKey = function(dictionary){
  //   let text = this.toString()
  //   for (let key in dictionary) {
  //     text = text.replace(new RegExp(`<${key}>`,'g'),dictionary[key])
  //   }
  //   return text
  // }
})
