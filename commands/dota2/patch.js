const { Command } = require('aghanim')

module.exports = new Command('patch',{
  category : 'Dota 2', help : 'Parche actual de dota', args : ''},
  async function (msg, args, client, command){
    // Fixme: cache patch text
    return msg.reply(client.cache.dota2Patch)
  })
