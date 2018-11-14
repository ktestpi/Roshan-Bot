const { Command } = require('aghanim')
const enumFeeds = require('../../enums/feeds')

module.exports = new Command('serverconfig',{
  category : 'Owner', help : 'Muestra la configuración del servidor', args : '<id/nombre servidor>',
  ownerOnly : true},
  function(msg, args, command){
    const serverID = args.from(1)
    const serverID_number = Number(serverID)
    let data, guild
    if(typeof serverID_number === 'number' && !isNaN(serverID_number)){
      data = this.cache.servers.data(serverID)
      guild = this.guilds.find(guild => guild.id === serverID)
    }else{
      guild = this.guilds.find(guild => guild.name.toLowerCase() === serverID.toLowerCase())
      if(guild){
        data = this.cache.servers.data(guild.id)
      }
    }
    if(!data || !guild){return}
    return msg.reply({embed : {
      title : this.locale.replace('serverConfigTitle',msg,{guildName : guild.name}),
      fields : [
        {name : this.locale.get('serverConfigInfo',msg), value : this.locale.replace('serverConfigInfoDesc',msg,{
          members : guild.memberCount,
          lang : this.locale.getFlag(msg),
          status : data.notifications.enable ? this.config.emojis.default.accept : this.config.emojis.default.error,
          can : (permissionsMemberInChannel(guild,this.user.id,data.notifications.channel).has("readMessages") && permissionsMemberInChannel(guild,this.user.id,data.notifications.channel).has("sendMessages")) ? "" : " " + this.config.emojis.default.noentry + " ",
          channel : guild.channels.find(c => c.id === data.notifications.channel).name
        }), inline : false},
        {name : this.locale.get('serverConfigFeeds',msg), value :  this.locale.replace('serverConfigFeedsDesc',msg,{
          status : data.feeds.enable ? this.config.emojis.default.accept : this.config.emojis.default.error,
          can : (permissionsMemberInChannel(guild,this.user.id,data.feeds.channel).has("readMessages") && permissionsMemberInChannel(guild,this.user.id,data.feeds.channel).has("sendMessages")) ? "" : " " + this.config.emojis.default.noentry + " ",
          channel : guild.channels.find(c => c.id === data.feeds.channel).name,
          subs : data.feeds.subs.split(',').map(s => enumFeeds.getValue(s)).join(', ')
        }), inline : false}
      ],
      color : this.config.color
    }})
  })

  function permissionsMemberInChannel(guild,member_id,channel_id){
    return guild.channels.find(c => c.id === channel_id).permissionsOf(member_id)
  }
