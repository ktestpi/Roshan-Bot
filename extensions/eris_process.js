const Aghanim = require('aghanim')
const { Extension } = require('aghanim')
// const Eris = require('eris')

module.exports = new Extension('testing',function(bot,Eris){
  Eris.Guild.prototype.membersWithRole = function(roleName){
    const role = this.roles.find(r => r.name === roleName)
    return role ? this.members.filter(m => m.roles.includes(role.id)) : []
  }
  Eris.Message.prototype.reply = function(content,file){
  	return this.channel.createMessage(content,file)
  }

  // console.log('dsadsaasad',Eris.Guild.prototype,this);
  Eris.Message.prototype.replyDM = function(content,file){
    return this.author.getDMChannel().then(channel => channel.createMessage(content,file))
  }

  Eris.Message.prototype.send = function(content,file,replace){
    let lang
    if(this.channel.type === 0){
      const svcached = this._client.cache.servers.get(this.channel.guild.id)
      lang = svcached ? svcached.lang : this._client.replace.defaultLang
    }else{
      const usercached = this._client.cache.profiles.get(this.author.id)
      lang = usercached ? usercached.lang : this._client.replace.defaultLang
    }
    if(typeof content === 'string'){content = this._client.replace.t(lang,content,replace,true)}
    else if(typeof content === 'object'){
      for (let key in content) {
        content[key] = this._client.replace.t(lang,content[key],replace[key] ? replace[key] : null,true)
      }
    }
	  return this.channel.createMessage(content,file)
  }

  // console.log('dsadsaasad',Eris.Guild.prototype,this);
  Eris.Message.prototype.sendDM = function(content,file,replace){
    let lang
    if(this.channel.type === 0){
      const svcached = this._client.cache.servers.get(this.channel.guild.id)
      lang = svcached ? svcached.lang : this._client.replace.defaultLang
    }else{
      const usercached = this._client.cache.profiles.get(this.author.id)
      lang = usercached ? usercached.lang : this._client.replace.defaultLang
    }
    if(typeof content === 'string'){content = this._client.replace.t(lang,content,replace,true)}
    else if(typeof content === 'object'){
      for (let key in content) {
        content[key] = this._client.replace.t(lang,content[key],replace[key] ? replace[key] : null,true)
      }
    }
    return this.author.getDMChannel().then(channel => channel.createMessage(content,file))
  }

  String.prototype.replaceKey = function(dictionary){
    let text = this.toString()
    for (let key in dictionary) {
      text = text.replace(new RegExp(`<${key}>`,'g'),dictionary[key])
    }
    return text
  }
})
