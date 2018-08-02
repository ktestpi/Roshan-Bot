const { Command } = require('aghanim')

module.exports = new Command('svleave',{
  category : 'Owner', help : 'Roshan sale de un servidor', args : '<cmd>',
  ownerOnly : true},
  function(msg, args, command){
    const sv = args[1]
    const guild = this.guilds.get(sv)
    if(!guild){return}
    this.leaveGuild(sv)
    msg.addReaction(config.emojis.default.accept)
    this.discordLog.controlMessage('svleave',`Guild abandonado: ${guild.id}`)
  })
