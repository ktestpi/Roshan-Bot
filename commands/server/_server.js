const { Command } = require('aghanim')
const enumFeeds = require('../../enums/feeds')
const on = 'on'
const off = 'off'
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'server.config.title',
  fields : [
    { name: 'server.config.info', value: 'server.config.infodesc', inline: false},
    { name: 'server.config.feeds', value: 'server.config.feedsdesc', inline: false}
  ]
})

module.exports = new Command('server',{
  category : 'Server', help : 'Muestra la configuración del servidor', args : '',
  rolesCanUse: 'aegis'},
  async function (msg, args, client, command){
    const data = client.cache.servers.data(msg.channel.guild.id)
    const guild = client.guilds.find(guild => guild.id === msg.channel.guild.id);
    if(!data || !guild){return}
    return msg.reply(embed, {
      guildname: guild.name,
      members: guild.memberCount,
      lang: client.components.NewLocale.getFlag(guild.account.lang),
      status_notifications: data.notifications.enable ? client.config.emojis.default.accept : client.config.emojis.default.error,
      can_notifications: (permissionsMemberInChannel(guild, client.user.id, data.notifications.channel).has("readMessages") && permissionsMemberInChannel(guild, client.user.id, data.notifications.channel).has("sendMessages")) ? "" : " " + client.config.emojis.default.noentry + " ",
      channel_notifications: guild.channels.find(c => c.id === data.notifications.channel).name,
      name: msg.author.locale('serverConfigFeeds'),
      status_feeds: data.feeds.enable ? client.config.emojis.default.accept : client.config.emojis.default.error,
      can_feeds: (permissionsMemberInChannel(guild, client.user.id, data.feeds.channel).has("readMessages") && permissionsMemberInChannel(guild, client.user.id, data.feeds.channel).has("sendMessages")) ? "" : " " + client.config.emojis.default.noentry + " ",
      channel_feeds: guild.channels.find(c => c.id === data.feeds.channel).name,
      subs: data.feeds.subs.split(',').map(s => enumFeeds.getValue(s)).join(', ')
    })
  })

  function permissionsMemberInChannel(guild,member_id,channel_id){
    return guild.channels.find(c => c.id === channel_id).permissionsOf(member_id)
  }
