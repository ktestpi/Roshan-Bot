const { Command } = require('aghanim')

module.exports = new Command('patchset',{
  category : 'Owner', help : 'Actualiza el mensaje de `r!patch`', args : '<mensaje del parche>',
  ownerOnly : true},
  function(msg, args, command){
    const patch = args.from(1)
    this.db.child('bot').update({patch : patch}).then(() => {
      //TODO: Caché patch
      msg.addReaction(this.config.emojis.default.accept)
      // this.logger.add('game',`Patch: **${patch}**`,true)
      this.discordLog.controlMessage('game',`Patch: **${patch}**`)
    })
  })
