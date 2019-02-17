const { Command } = require('aghanim')

module.exports = new Command('leaderboard',{
  category : 'Dota 2', help : 'Tabla de líderes de Roshan', args : ''},
  async function(msg, args, client){
    return msg.reply('leaderboard.text')
  })
