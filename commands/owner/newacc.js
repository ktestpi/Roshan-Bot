const { Command } = require('aghanim')
const { Datee, Request } = require('erisjs-utils')

module.exports = new Command('newacc',{
  category : 'Owner', help : 'Registro en el bot', args : '<discordID> <dotaID> [steamID] [twitchID] [twitterID]',
  ownerOnly : true},
  async function(msg, args, client){

  })
