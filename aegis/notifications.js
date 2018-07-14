const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const on = 'on'
const off = 'off'

module.exports = new Command('notifications',{subcommandFrom : 'server',
  category : 'Aegis', help : 'Configuración de notificaciones', args : '<on,off,[channel]>',
  rolesCanUse: 'aegis'},
  function(msg, args, command){
    let self = this
    console.log(args);
    if(args[2] === on){
      this.cache.servers.modify(msg.channel.guild.id,{notifications : {enable : true}}).then((newElement) => msg.addReaction(this.config.emojis.default.accept))
    }else if(args[2] === off){
      console.log('off');
      this.cache.servers.modify(msg.channel.guild.id,{notifications : {enable : false}}).then((newElement) => msg.addReaction(this.config.emojis.default.accept))
    }else{
      const match = msg.content.match(new RegExp('<#(\\d*)>'));
      console.log('MATCH',match);
      if(!match){return};
      const channel = msg.channel.guild.channels.get(match[1]);
      if(!channel){return};
      this.cache.servers.modify(msg.channel.guild.id,{notifications : {channel : match[1]}}).then((newElement) => msg.addReaction(this.config.emojis.default.accept))
    }
  })