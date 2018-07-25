const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('newserver',{
  category : 'Owner', help : 'Añade nuevo servidor', args : '<serverID>'},
  function(msg, args, command){
    // let self = this
    const guild = this.guilds.get(args[1])
    if(!guild){return msg.addReaction(this.config.emojis.default.error)}
    this.createMessage(this.config.guild.notifications,{
      embed : {
        title : lang.newServer,
        description : "**Nombre:** `" + guild.name + "`\n**ID:** `" + guild.id + "`\n**Miembros:** `" + guild.memberCount
          + "`\n**Propietari@:** `" + guild.members.get(guild.ownerID).username + "`\n**Región:** `" + guild.region + "`\n**Creado:** `" + util.date(guild.createdAt,'log') + "`",
        thumbnail : {url : guild.iconURL || this.user.avatarURL, height : 40, width : 40},
        footer : {text : guild.name + ' | ' + guild.id + ' | ' + util.date(guild.joinedAt,'log'),icon_url : this.user.avatarURL},
        color: this.config.color
      }
    })
    resetServerConfig(this,guild)
    // this.logger.add('guildnew',guild.name,true);
    this.discordLog.controlMessage('guildnew',`**${guild.name}**`)
  })
