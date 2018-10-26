const { Event } = require('aghanim')
const { resetServerConfig } = require('../helpers/basic.js')
const { Datee , Guild } = require('erisjs-utils')

module.exports = new Event('guild_create','guildCreate',{}, function(guild){
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
      title : 'Nuevo servidor',
      description : "**Nombre:** `" + guild.name + "`\n**ID:** `" + guild.id + "`\n**Miembros:** `" + guild.memberCount
        + "`\n**Propietari@:** `" + guild.members.get(guild.ownerID).username + "`\n**Región:** `" + guild.region + "`\n**Creado:** `" + Datee.custom(guild.createdAt,'D/M/Y h:m:s',true) + "`",
      thumbnail : {url : guild.iconURL || this.user.avatarURL, height : 40, width : 40},
      footer : {text : guild.name + ' | ' + guild.id + ' | ' + Datee.custom(guild.joinedAt,'D/M/Y h:m:s',true),icon_url : this.user.avatarURL},
      color: this.config.color
    }
  })
  resetServerConfig(this,guild)
    .then(() => {
        this.discordLog.controlMessage('guildnew',`**${guild.name}**`)
        const defaultChannel = Guild.getDefaultChannel(guild,this,true)
        if(defaultChannel){
          defaultChannel.createMessage(`:flag_gb: Hi, I am a **Dota 2** and **Artifact** bot. Read the **server guide**: use \`r!getstarted\``)
        }
    })
    .catch(err => this.discordLog.controlMessage('error',`Error creating server config for **${guild.name}** (${guild.id})`))
  // this.logger.add('guildnew',guild.name,true)
})
