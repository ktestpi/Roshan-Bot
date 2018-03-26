const { Command } = require('drow')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const on = 'on'
const off = 'off'

module.exports = new Command('feeds',{subcommandFrom : 'server',
  category : 'Aegis', help : 'Configuración de feeds', args : '<on,off,[channel]>',
  rolesCanUse: 'aegis'},
  function(msg, args, command){
    let self = this
    if(args[2] === on){
      this.cache.servers.modify({feeds : {enable : true}}).then(() => msg.addReaction(this.config.emojis.default.accept))
    }else if(args[2] === off){
      this.cache.servers.modify({feeds : {enable : false}}).then(() => msg.addReaction(this.config.emojis.default.accept))
    }else{
      const match = msg.content.match(new RegExp('<#(\\d*)>'));
      if(!match){return};
      const channel = msg.channel.guild.channels.get(match[1]);
      if(!channel){return};
      this.cache.servers.modify({feeds : {channel : match[1]}}).then(() => msg.addReaction(this.config.emojis.default.accept))
    }
  })
