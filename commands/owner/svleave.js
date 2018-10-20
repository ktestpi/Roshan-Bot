const { Command } = require('aghanim')

module.exports = new Command('svleave',{
  category : 'Owner', help : 'Roshan sale de un servidor', args : '<serverID>',
  ownerOnly : true},
  function(msg, args, command){
    const guild = this.guilds.get(args[1])
    if(!guild){return}
    this.leaveGuild(guild.id)
    msg.addReaction(this.config.emojis.default.accept)
    this.discordLog.controlMessage('svleave',`Guild abandonado: ${guild.id}`)
  })
