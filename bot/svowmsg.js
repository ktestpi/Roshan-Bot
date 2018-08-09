const { Command } = require('aghanim')
const lang = require('../lang.json')

module.exports = new Command('svowmsg',{
  category : 'Owner', help : 'Mensage a propietario del servidor', args : '<guildID>',
  ownerOnly : true},
  function(msg, args, command){
    if(!args[1]){return msg.reply(lang.errorNoServerID)}
    const id = args[1];
    const guild = this.guilds.get(id);
    if(!guild){return msg.reply(lang.errorGuildNotFound)}
    const owner = guild.members.get(guild.ownerID);
    const message = args.from(2)
    const embed = {
      author : {name : `Mensaje propietario: ${guild.name}`, icon_url : guild.iconURL},
      // title : message.reason,
      description : message,
      // thumbnail : {url : owner.avatarURL, height : 40, width : 40},
      footer : {text : this.user.username ,icon_url : this.user.avatarURL},
      color : this.config.colors.sendMsg.owner
    }
    owner.user.getDMChannel().then(channel => {
      channel.createMessage({embed}).then(() => this.createMessage(this.config.guild.notifications,{embed}))
      // courier.send('log',{info : `${owner.username} | ${guild.name} | ${guild.id}`, info_icon : guild.iconURL, reason : `Propietario servidor`, message : message, color : config.colors.sendMsg.owner},{bot})
    })
  })
