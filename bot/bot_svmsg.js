const { Command } = require('drow')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('svmsg',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Mensaje a servidor', args : '<id> [mensaje]',
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
      author : {name : `Mensaje servidor: ${guild.name}`, icon_url : guild.iconURL},
      // title : message.reason,
      description : message,
      // thumbnail : {url : owner.avatarURL, height : 40, width : 40},
      footer : {text : this.user.username ,icon_url : this.user.avatarURL},
      color : this.config.colors.sendMsg.server
    }
    util.guild.getDefaultChannel(guild).createMessage({embed})
    this.createMessage(this.config.guild.notifications,{embed})
  })
