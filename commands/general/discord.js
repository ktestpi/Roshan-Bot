const { Command } = require('aghanim')

module.exports = new Command(['discord','foso','devserver'],{
  category : 'General', help : 'Invitación al Discord de desarrollo de Roshan', args : ''},
  async function(msg, args, client){
    return msg.reply('discord.devserverinvite')
  })
