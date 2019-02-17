const { Command } = require('aghanim')
const { Datee } = require('erisjs-utils')

module.exports = new Command('newserver',{
  category : 'Owner', help : 'Añade nuevo servidor', args : '<serverID>'},
  async function(msg, args, client){
    const guild = client.guilds.get(args[1])
    if(!guild){return msg.addReaction(client.config.emojis.default.error)}

  })
