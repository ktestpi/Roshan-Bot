const { Command } = require('aghanim')
const lang = require('../lang.json')

module.exports = new Command('usermsg',{
  category : 'Owner', help : 'Mensaje a usuari@', args : '<id> [mensaje]',
  ownerOnly : true},
  function(msg, args, command){
    const id = args[1];
    const user = this.users.find(user => user.id === id)
    if(!user){return msg.reply(lang.errorUserNotFound)}
    const message = args.from(2)
    const embed = {
      author : {name : `Mensaje privado a: ${user.username}`, icon_url : user.avatarURL},
      // title : message.reason,
      description : message,
      // thumbnail : {url : owner.avatarURL, height : 40, width : 40},
      footer : {text : this.user.username ,icon_url : this.user.avatarURL},
      color : this.config.colors.sendMsg.owner
    }
    user.getDMChannel().then(channel => {
      channel.createMessage({embed})
      this.createMessage(this.config.guild.notifications,{embed})
    })
  })
