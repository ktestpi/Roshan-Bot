const { Event } = require('aghanim')
const lang = require('../lang.json')
const { resetServerConfig } = require('../helpers/basic.js')
const { Datee } = require('erisjs-utils')

module.exports = new Event('','guildCreate',{}, function(guild){
  // console.log('Watcher active',emoji,userID,this.config.emojis.default);
  // bot.createMessage(guild.id,{
  //   embed: {
  //     title : lang.guildCreateEmbedTitle,
  //     description : this.replace.do(lang.guildCreateEmbedDescription,{server : this.config.server},true),
  //     thumbnail : {url : this.user.avatarURL, height : 40, width : 40},
  //     footer : {
  //       text : this.replace.do(lang.botCreated),
  //       icon_url : this.owner.avatarURL
  //     },
  //     color : this.config.color
  //   }
  // });
  this.createMessage(this.config.guild.notifications,{
    embed : {
      title : lang.newServer,
      description : "**Nombre:** `" + guild.name + "`\n**ID:** `" + guild.id + "`\n**Miembros:** `" + guild.memberCount
        + "`\n**Propietari@:** `" + guild.members.get(guild.ownerID).username + "`\n**Región:** `" + guild.region + "`\n**Creado:** `" + Datee.custom(guild.createdAt,'D/M/S h:m:s') + "`",
      thumbnail : {url : guild.iconURL || this.user.avatarURL, height : 40, width : 40},
      footer : {text : guild.name + ' | ' + guild.id + ' | ' + Datee.custom(guild.joinedAt,'D/M/Y h:m:s'),icon_url : this.user.avatarURL},
      color: this.config.color
    }
  })
  resetServerConfig(this,guild).then(() => this.discordLog.controlMessage('guildnew',`**${guild.name}**`)).catch(err => this.discordLog.controlMessage('error',`Error creating cofing for **${guild.name}** (${guild.id})`))
  // this.logger.add('guildnew',guild.name,true)
})
