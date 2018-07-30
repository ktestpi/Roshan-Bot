const Aghanim = require('aghanim')
const { Extension } = require('aghanim')
// const Eris = require('eris')

module.exports = new Extension('testing',function(bot,Eris){
  Eris.Guild.prototype.membersWithRole = function(roleName){
    const role = this.roles.find(r => r.name === roleName)
    return role ? this.members.filter(m => m.roles.includes(role.id)) : []
  }
  Eris.Message.prototype.reply = function(message,file){
  	return new Promise((resolve,reject) => {
  		this.channel.createMessage(message,file).then(m => resolve(m)).catch(err => reject(err))
  	})
  }

  // console.log('dsadsaasad',Eris.Guild.prototype,this);
  Eris.Message.prototype.replyDM = function(content,file){
    return new Promise((resolve,reject) => {
      this.author.getDMChannel().then(channel => channel.createMessage(content,file)).then(m => resolve(m)).catch(err => reject(err))
    })
  }

  String.prototype.replaceKey = function(dictionary){
    let text = this.toString()
    for (let key in dictionary) {
      text = text.replace(new RegExp(`<${key}>`,'g'),dictionary[key])
    }
    return text
  }
})
