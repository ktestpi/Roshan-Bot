const on = 'on'
const off = 'off'

module.exports = {
  name: 'notifications',
  childOf: 'server',
  category: 'Server',
  help: 'Configuración de notificaciones',
  args: '<on,off,[channel]>',
  requirements: [
    {
      type: 'member.has.role',
      role: 'aegis',
      incaseSensitive: true
    }
  ],
  run: async function (msg, args, client, command){
    if(args[2] === on){
      return client.cache.servers.save(msg.channel.guild.id,{notifications : {enable : true}}).then((newElement) => msg.addReactionSuccess())
    }else if(args[2] === off){
      return client.cache.servers.save(msg.channel.guild.id,{notifications : {enable : false}}).then((newElement) => msg.addReactionSuccess())
    }else{
      const match = msg.content.match(new RegExp('<#(\\d*)>'));
      if(!match){return};
      const channel = msg.channel.guild.channels.get(match[1]);
      if(!channel){return};
      return client.cache.servers.save(msg.channel.guild.id,{notifications : {channel : match[1]}}).then((newElement) => msg.addReactionSuccess())
    }
  }
}
