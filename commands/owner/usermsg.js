const { Command } = require('aghanim')

module.exports = new Command('usermsg',{
  category : 'Owner', help : 'Mensaje a usuari@', args : '<id> [mensaje]',
  ownerOnly : true},
  async function(msg, args, client){
    const id = args[1];
    const user = client.users.find(user => user.id === id)
    if(!user){return msg.replyLocale('errorUserNotFound')}
    const message = args.from(2)
    const embed = {
      author : {name : `Private message: ${user.username}`, icon_url : user.avatarURL},
      // title : message.reason,
      description : message,
      // thumbnail : {url : owner.avatarURL, height : 40, width : 40},
      footer : {text : client.user.username ,icon_url : client.user.avatarURL},
      color : client.config.colors.sendMsg.owner
    }
    return user.getDMChannel().then(channel => {
      channel.createMessage({embed})
      client.createMessage(client.config.guild.notifications,{embed})
    })
  })
