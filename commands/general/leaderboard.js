const { Command } = require('aghanim')

module.exports = new Command('leaderboard',{
  category : 'Dota 2', help : 'Tabla de líderes de Roshan', args : ''},
  function(msg, args, command){
    return msg.reply(this.locale.replacer(this.locale.getUserString('leaderboard',msg),{link : this.config.links.web_leaderboard}))
  })
