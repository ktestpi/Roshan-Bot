const { Command } = require('aghanim')

module.exports = new Command('patch',{
  category : 'Dota 2', help : 'Parche actual de dota', args : ''},
  function(msg, args, command){
    return this.db.child('bot/patch').once('value').then(snap => msg.reply(snap.val()))
  })
