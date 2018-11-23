const { Command } = require('aghanim')
const on = 'on'
const off = 'off'

module.exports = new Command('feeds',{subcommandFrom : 'server',
  category : 'Server', help : 'Configuración de feeds', args : '<on,off,[channel]>',
  rolesCanUse: 'aegis'},
  function(msg, args, command){
    // let self = this
    if(args[2] === on){
      return this.cache.servers.save(msg.channel.guild.id,{feeds : {enable : true}}).then(() => msg.addReaction(this.config.emojis.default.accept))
    }else if(args[2] === off){
      return this.cache.servers.save(msg.channel.guild.id,{feeds : {enable : false}}).then(() => msg.addReaction(this.config.emojis.default.accept))
    }else{
      const match = msg.content.match(new RegExp('<#(\\d*)>'));
      if(!match){return};
      const channel = msg.channel.guild.channels.get(match[1]);
      if(!channel){return};
      return this.cache.servers.save(msg.channel.guild.id,{feeds : {channel : match[1]}}).then(() => msg.addReaction(this.config.emojis.default.accept))
    }
  })
