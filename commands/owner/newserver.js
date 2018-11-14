const { Command } = require('aghanim')
const { Datee } = require('erisjs-utils')

module.exports = new Command('newserver',{
  category : 'Owner', help : 'Añade nuevo servidor', args : '<serverID>'},
  function(msg, args, command){
    // let self = this
    const guild = this.guilds.get(args[1])
    if(!guild){return msg.addReaction(this.config.emojis.default.error)}

  })
