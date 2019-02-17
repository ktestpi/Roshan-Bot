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
  async function(msg, args, client){
    const data = client.cache.servers.data(msg.channel.guild.id)
    const guild = client.guilds.find(guild => guild.id === msg.channel.guild.id);
    if(!data || !guild){return}
    return msg.reply(embed, {
      guildname: guild.name,
      members: guild.memberCount,
      lang: client.locale.getChannelFlag(msg),
      status_notifications: data.notifications.enable ? client.config.emojis.default.accept : client.config.emojis.default.error,
      can_notifications: (permissionsMemberInChannel(guild, client.user.id, data.notifications.channel).has("readMessages") && permissionsMemberInChannel(guild, client.user.id, data.notifications.channel).has("sendMessages")) ? "" : " " + client.config.emojis.default.noentry + " ",
      channel_notifications: guild.channels.find(c => c.id === data.notifications.channel).name,
      name: args.user.langstring('serverConfigFeeds'),
      status_feeds: data.feeds.enable ? client.config.emojis.default.accept : client.config.emojis.default.error,
      can_feeds: (permissionsMemberInChannel(guild, client.user.id, data.feeds.channel).has("readMessages") && permissionsMemberInChannel(guild, client.user.id, data.feeds.channel).has("sendMessages")) ? "" : " " + client.config.emojis.default.noentry + " ",
      channel_feeds: guild.channels.find(c => c.id === data.feeds.channel).name,
      subs: data.feeds.subs.split(',').map(s => enumFeeds.getValue(s)).join(', ')
    })
    // return msg.reply({embed : {
    //   title : args.user.locale('serverConfigTitle',{guildName : guild.name}),
    //   fields : [
    //     {name : args.user.langstring('serverConfigInfo'), value : args.user.locale('serverConfigInfoDesc',{
    //       members : guild.memberCount,
    //       lang : client.locale.getChannelFlag(msg),
    //       status : data.notifications.enable ? client.config.emojis.default.accept : client.config.emojis.default.error,
    //       can : (permissionsMemberInChannel(guild,client.user.id,data.notifications.channel).has("readMessages") && permissionsMemberInChannel(guild,client.user.id,data.notifications.channel).has("sendMessages")) ? "" : " " + client.config.emojis.default.noentry + " ",
    //       channel : guild.channels.find(c => c.id === data.notifications.channel).name
    //     }), inline : false},
    //     {
    //       name: args.user.langstring('serverConfigFeeds'), value: args.user.locale('serverConfigFeedsDesc',{
    //       status : data.feeds.enable ? client.config.emojis.default.accept : client.config.emojis.default.error,
    //       can : (permissionsMemberInChannel(guild,client.user.id,data.feeds.channel).has("readMessages") && permissionsMemberInChannel(guild,client.user.id,data.feeds.channel).has("sendMessages")) ? "" : " " + client.config.emojis.default.noentry + " ",
    //       channel : guild.channels.find(c => c.id === data.feeds.channel).name,
    //       subs : data.feeds.subs.split(',').map(s => enumFeeds.getValue(s)).join(', ')
    //     }), inline : false}
    //   ],
    //   color : client.config.color
    // }})
  })

  function permissionsMemberInChannel(guild,member_id,channel_id){
    return guild.channels.find(c => c.id === channel_id).permissionsOf(member_id)
  }
