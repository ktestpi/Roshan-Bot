const { Command } = require('drow')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('svowmsg',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Comando de control del bot', args : '<cmd>',
  ownerOnly : true},
  function(msg, args, command){
    let self = this
    if(!args[2]){return}
    const id = args[2];
    const guild = this.guilds.get(id);
    if(!guild){return}
    const owner = guild.members.get(guild.ownerID);
    const message = args.from(3)
    const embed = {
      author : {name : `Mensaje propietario: ${guild.name}`, icon_url : guild.iconURL},
      // title : message.reason,
      description : message,
      // thumbnail : {url : owner.avatarURL, height : 40, width : 40},
      footer : {text : this.user.username ,icon_url : this.user.avatarURL},
      color : this.config.colors.sendMsg.owner
    }
    owner.user.getDMChannel().then(channel => {
      channel.createMessage({embed})
      // courier.send('log',{info : `${owner.username} | ${guild.name} | ${guild.id}`, info_icon : guild.iconURL, reason : `Propietario servidor`, message : message, color : config.colors.sendMsg.owner},{bot})
      this.createMessage(this.config.guild.notifications,{embed})
    })
  })
