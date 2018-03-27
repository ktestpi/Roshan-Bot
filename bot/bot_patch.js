const { Command } = require('aghanim')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('patch',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Actualiza el mensaje de `r!patch`', args : '<mensaje del parche>',
  ownerOnly : true},
  function(msg, args, command){
    // let self = this
    const patch = args.from('scmd')
    this.db.child('bot').update({patch : patch}).then(() => {msg.addReaction(this.config.emojis.default.accept)
    this.logger.add('game',`Patch: **${patch}**`,true)
    })
  })
