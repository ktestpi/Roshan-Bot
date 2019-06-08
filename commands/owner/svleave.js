const { Command } = require('aghanim')

module.exports = new Command('svleave',{
  category : 'Owner', help : 'Roshan sale de un servidor', args : '<serverID>',
  ownerOnly : true},
  async function(msg, args, client){
    const guild = client.guilds.get(args[1])
    if(!guild){return}
    client.leaveGuild(guild.id)
    msg.addReaction(client.config.emojis.default.accept)
    client.components.Notifier.controlMessage('svleave',`Guild abandonado: ${guild.id}`)
  })
