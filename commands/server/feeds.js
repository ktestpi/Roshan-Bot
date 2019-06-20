const { Command } = require('aghanim')
const on = 'on'
const off = 'off'

module.exports = new Command('feeds',{subcommandFrom : 'server',
  category : 'Server', help : 'Configuración de feeds', args : '<on,off,[channel]>',
  rolesCanUse: 'aegis'},
  async function (msg, args, client, command){
    if(args[2] === on){
      return client.cache.servers.save(msg.channel.guild.id,{feeds : {enable : true}}).then(() => msg.addReactionSuccess)
    }else if(args[2] === off){
      return client.cache.servers.save(msg.channel.guild.id,{feeds : {enable : false}}).then(() => msg.addReactionSuccess)
    }else{
      const match = msg.content.match(new RegExp('<#(\\d*)>'));
      if(!match){return};
      const channel = msg.channel.guild.channels.get(match[1]);
      if(!channel){return};
      return client.cache.servers.save(msg.channel.guild.id,{feeds : {channel : match[1]}}).then(() => msg.addReactionSuccess)
    }
  })
