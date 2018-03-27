const { Watcher } = require('aghanim')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const { resetServerConfig } = require('../helpers/basic.js')

module.exports = new Watcher('','guildCreate',{}, function(guild){
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
        + "`\n**Propietari@:** `" + guild.members.get(guild.ownerID).username + "`\n**Región:** `" + guild.region + "`\n**Creado:** `" + util.date(guild.createdAt,'log') + "`",
      thumbnail : {url : guild.iconURL || this.user.avatarURL, height : 40, width : 40},
      footer : {text : guild.name + ' | ' + guild.id + ' | ' + util.date(guild.joinedAt,'log'),icon_url : this.user.avatarURL},
      color: this.config.color
    }
  })
  resetServerConfig(this,guild)
  this.logger.add('guildnew',guild.name,true);
})
