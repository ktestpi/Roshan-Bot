const { Command } = require('aghanim')

module.exports = new Command('patchset',{
  category : 'Owner', help : 'Actualiza el mensaje de `r!patch`', args : '<mensaje del parche>',
  ownerOnly : true},
  function(msg, args, command){
    const patch = args.from(1)
    return this.db.child('bot').update({patch : patch}).then(() => {
      //TODO: Caché patch
      return msg.addReaction(this.config.emojis.default.accept)
    })
  })
