const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')
const on = 'on'
const off = 'off'

module.exports = new Command('config',{subcommandFrom : 'server',
  category : 'Aegis', help : 'Muestra la configuración del servidor', args : '',
  rolesCanUse: 'aegis'},
  function(msg, args, command){
    const data = this.cache.servers.data(msg.channel.guild.id)
    const guild = this.guilds.find(guild => guild.id === msg.channel.guild.id);
    if(!data || !guild){return}
    var text = '```';
    text += lang.serverConfigTitle.replaceKey({guildName : guild.name})
    text += lang.serverConfigInfoMembers.replaceKey({members : guild.memberCount})
    text += lang.serverConfigNotifications.replaceKey({
      status : data.notifications.enable ? this.config.emojis.default.accept : this.config.emojis.default.error,
      can : (permissionsMemberInChannel(guild,this.user.id,data.notifications.channel).has("readMessages") && permissionsMemberInChannel(guild,this.user.id,data.notifications.channel).has("sendMessages")) ? "" : " " + this.config.emojis.default.noentry + " ",
      channel : guild.channels.find(c => c.id === data.notifications.channel).name
    })
    text += lang.serverConfigFeeds.replaceKey({
      status : data.feeds.enable ? this.config.emojis.default.accept : this.config.emojis.default.error,
      can : (permissionsMemberInChannel(guild,this.user.id,data.feeds.channel).has("readMessages") && permissionsMemberInChannel(guild,this.user.id,data.feeds.channel).has("sendMessages")) ? "" : " " + this.config.emojis.default.noentry + " ",
      channel : guild.channels.find(c => c.id === data.feeds.channel).name
    })
    text += '```';
    return msg.reply(text);
  })

  function permissionsMemberInChannel(guild,member_id,channel_id){
    return guild.channels.find(c => c.id === channel_id).permissionsOf(member_id)
  }
