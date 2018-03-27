const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const on = 'on'
const off = 'off'

module.exports = new Command('config',{subcommandFrom : 'server',
  category : 'Aegis', help : 'Muestra la configuración del servidor', args : '',
  rolesCanUse: 'aegis'},
  function(msg, args, command){
    let self = this
    const data = this.cache.servers.data(msg.channel.guild.id)
    console.log('DATA',data);
    const guild = this.guilds.find(guild => guild.id === msg.channel.guild.id);
    if(!data || !guild){return}
    var text = '```';
    text += `Configuración - ${guild.name}\n\n`;
    text += `ℹ Info\n  · Miembr@s: ${guild.memberCount}\n`
    text += `${this.config.emojis.default.notification} Notificaciones: ${data.notifications.enable ? this.config.emojis.default.accept : this.config.emojis.default.error}${(permissionsMemberInChannel(guild,this.user.id,data.notifications.channel).has("readMessages") && permissionsMemberInChannel(guild,this.user.id,data.notifications.channel).has("sendMessages")) ? "" : " " + this.config.emojis.default.noentry + " "}(#${guild.channels.find(c => c.id === data.notifications.channel).name})\n`
    text += `${this.config.emojis.default.feeds} Feeds: ${data.feeds.enable ? this.config.emojis.default.accept : this.config.emojis.default.error}${(permissionsMemberInChannel(guild,this.user.id,data.feeds.channel).has("readMessages") && permissionsMemberInChannel(guild,this.user.id,data.feeds.channel).has("sendMessages")) ? "" : " " + this.config.emojis.default.noentry + " "}(#${guild.channels.find(c => c.id === data.feeds.channel).name})\n`
    text += '```';
    msg.reply(text);
  })

  function permissionsMemberInChannel(guild,member_id,channel_id){
    return guild.channels.find(c => c.id === channel_id).permissionsOf(member_id)
  }
