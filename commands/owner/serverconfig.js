const enumFeeds = require('../../enums/feeds')

module.exports = {
  name: 'serverconfig',
  category : 'Owner',
  help : 'Muestra la configuración del servidor',
  args : '<id/nombre servidor>',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    const serverID = args.from(1)
    const serverID_number = Number(serverID)
    let data, guild
    if(typeof serverID_number === 'number' && !isNaN(serverID_number)){
      data = client.cache.servers.data(serverID)
      guild = client.guilds.find(guild => guild.id === serverID)
    }else{
      guild = client.guilds.find(guild => guild.name.toLowerCase() === serverID.toLowerCase())
      if(guild){
        data = client.cache.servers.data(guild.id)
      }
    }
    if(!data || !guild){return}
    return msg.reply({embed : {
      title : client.locale.replace('serverConfigTitle',msg,{guildName : guild.name}),
      fields : [
        {name : client.locale.get('serverConfigInfo',msg), value : client.locale.replace('serverConfigInfoDesc',msg,{
          members : guild.memberCount,
          lang : client.locale.getFlag(msg),
          status : data.notifications.enable ? client.config.emojis.default.accept : client.config.emojis.default.error,
          can : (permissionsMemberInChannel(guild,client.user.id,data.notifications.channel).has("readMessages") && permissionsMemberInChannel(guild,this.user.id,data.notifications.channel).has("sendMessages")) ? "" : " " + this.config.emojis.default.noentry + " ",
          channel : guild.channels.find(c => c.id === data.notifications.channel).name
        }), inline : false},
        {name : client.locale.get('serverConfigFeeds',msg), value :  client.locale.replace('serverConfigFeedsDesc',msg,{
          status : data.feeds.enable ? client.config.emojis.default.accept : client.config.emojis.default.error,
          can : (permissionsMemberInChannel(guild,client.user.id,data.feeds.channel).has("readMessages") && permissionsMemberInChannel(guild,this.user.id,data.feeds.channel).has("sendMessages")) ? "" : " " + this.config.emojis.default.noentry + " ",
          channel : guild.channels.find(c => c.id === data.feeds.channel).name,
          subs : data.feeds.subs.split(',').map(s => enumFeeds.getValue(s)).join(', ')
        }), inline : false}
      ],
      color : client.config.color
    }})
  }
}

function permissionsMemberInChannel(guild,member_id,channel_id){
  return guild.channels.find(c => c.id === channel_id).permissionsOf(member_id)
}
