const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const { Datee } = require('erisjs-utils')
const lang = require('../lang.json')
const { resetServerConfig } = require('../helpers/basic.js')

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
          + "`\n**Propietari@:** `" + guild.members.get(guild.ownerID).username + "`\n**Región:** `" + guild.region + "`\n**Creado:** `" + Datee.custom(guild.createdAt,'D/M/Y h:m:s') + "`",
        thumbnail : {url : guild.iconURL || this.user.avatarURL, height : 40, width : 40},
        footer : {text : guild.name + ' | ' + guild.id + ' | ' + Datee.custom(guild.joinedAt,'D/M/Y h:m:s'),icon_url : this.user.avatarURL},
        color: this.config.color
      }
    })
    resetServerConfig(this,guild).then(() => this.discordLog.controlMessage('guildnew',`**${guild.name}**`))
  })
