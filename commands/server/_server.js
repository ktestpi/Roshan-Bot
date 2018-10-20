const { Command } = require('aghanim')
const opendota = require('../../helpers/opendota')
const basic = require('../../helpers/basic')
const enumFeeds = require('../../enums/feeds')
const on = 'on'
const off = 'off'

module.exports = new Command('server',{
  category : 'Server', help : 'Muestra la configuración del servidor', args : '',
  rolesCanUse: 'aegis'},
  function(msg, args, command){
    const data = this.cache.servers.data(msg.channel.guild.id)
    const guild = this.guilds.find(guild => guild.id === msg.channel.guild.id);
    if(!data || !guild){return}
    const lang = this.locale.getChannelStrings(msg)
    return msg.reply({embed : {
      title : this.locale.replacer(lang.serverConfigTitle,{guildName : guild.name}),
      fields : [
        {name : lang.serverConfigInfo, value : this.locale.replacer(lang.serverConfigInfoDesc,{
          members : guild.memberCount,
          lang : this.locale.getChannelFlag(msg),
          status : data.notifications.enable ? this.config.emojis.default.accept : this.config.emojis.default.error,
          can : (permissionsMemberInChannel(guild,this.user.id,data.notifications.channel).has("readMessages") && permissionsMemberInChannel(guild,this.user.id,data.notifications.channel).has("sendMessages")) ? "" : " " + this.config.emojis.default.noentry + " ",
          channel : guild.channels.find(c => c.id === data.notifications.channel).name
        }), inline : false},
        {name : lang.serverConfigFeeds, value :  this.locale.replacer(lang.serverConfigFeedsDesc,{
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
