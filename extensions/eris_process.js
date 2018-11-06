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
  function localeUserString(msg, str, repl){
    const phrase = msg._client.locale.getUserString(str,msg)
    if (phrase) {
      return msg._client.locale.replacer(phrase, repl)
    }
    return str
  }
  
  function localeChannelString(msg, str, repl) {
    const phrase = msg._client.locale.getChannelString(str, msg)
    if (phrase) {
      return msg._client.locale.replacer(phrase, repl)
    }
    return str
  }

  function parseEmbed(msg, embed, repl, parse = [], locale, current = ''){
    console.log('I',embed);
    Object.keys(embed).forEach((key,index) => {
      // console.log('key',key);
      const ckey = `${current}.${key}`
      console.log('key/ckey',key,ckey,index)
      if(typeof embed[key] === 'string'){
        embed[key] = parse.includes(ckey) ? locale(msg, embed[key], repl) : embed[key]
      }else if(typeof embed[key] === 'object'){
        embed[key] = parseEmbed(msg, embed[key], repl, parse, locale, ckey)
      }
    })
    return embed
  }

  function messageComposition(msg, content, repl, locale){
    return typeof content === 'string'
      ? locale(msg, content, repl)
      : parseEmbed(msg, content, repl, [
        '.content',
        '.embed.title',
        '.embed.description',
        '.embed.thumbnail.url',
        '.embed.footer.text',
        '.embed.fields.0.name',
        '.embed.fields.0.value',
        '.embed.fields.1.name',
        '.embed.fields.1.value',
        '.embed.fields.2.name',
        '.embed.fields.2.value',
        '.embed.fields.3.name',
        '.embed.fields.3.value',
        '.embed.fields.4.name',
        '.embed.fields.4.value',
        '.embed.fields.5.name',
        '.embed.fields.5.value',
        '.embed.fields.6.name',
        '.embed.fields.6.value'
      ], locale)
  }

  Eris.Message.prototype.replyUL = function(content, repl, file){
    return this.reply(messageComposition(this, content, repl, localeUserString), file)
  }
  
  Eris.Message.prototype.replyULDM = function (content, repl, file) {
    return this.replyDM(messageComposition(this, content, repl, localeUserString), file)
  }

  Eris.Message.prototype.replyCL = function (content, repl, file) {
    return this.reply(messageComposition(this, content, repl, localeChannelString), file)
  }

  Eris.Message.prototype.replyCLDM = function (content, repl, file) {
    return this.replyDM(messageComposition(this, content, repl, localeChannelString), file)
  }

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
