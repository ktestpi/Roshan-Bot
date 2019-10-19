const { Classes } = require('erisjs-utils')

module.exports = {
  name: 'servers',
  category : 'Owner', help : 'Información de los servidores', args : '',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    let table = new Classes.Table(['ID','N','F','Server','Members','Owner'],['18','1','1','20r','7c','15'],'.');
    const guilds = client.guilds.map(guild => {
      const cache = client.cache.servers.get(guild.id)
      return cache ? ({id : guild.id, name : guild.name, owner : guild.members.get(guild.ownerID).username, members : guild.memberCount, notifications : cache.notifications.enable, feeds : cache.feeds.enable}) : undefined
    }).filter(guild => guild)
    guilds.forEach(guild => table.addRow([guild.id,guild.notifications ? '+' : '-',guild.feeds ? '+' : '-',guild.name,guild.members,guild.owner]))
    msg.reply({embed : {title : `Notificaciones de los Servidores (${guilds.length})`,description : table.render()}})
  }
}
