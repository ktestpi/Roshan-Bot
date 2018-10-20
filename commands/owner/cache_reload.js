const { Command } = require('aghanim')

module.exports = new Command('cachereload',{
  category : 'Owner', help : 'Recarga la cache', args : ''},
  function(msg, args, command){
    this.cacheReload().then(() => msg.addReaction(this.config.emojis.default.accept))
  })
