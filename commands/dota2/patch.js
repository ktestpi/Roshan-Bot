const { Command } = require('aghanim')

module.exports = new Command('patch',{
  category : 'Dota 2', help : 'Parche actual de dota', args : ''},
  async function(msg, args, client){
    return client.db.child('bot/patch').once('value').then(snap => msg.reply(snap.val()))
  })
