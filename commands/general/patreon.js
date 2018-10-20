const { Command } = require('aghanim')

module.exports = new Command(['patreon','donate'],{
  category : 'General', help : '❤ Dona para apoyar el bot', args : ''},
  function(msg, args, command){
    return msg.reply(this.locale.replacer(this.locale.getUserString('linkPatreon',msg),{link : this.config.links.patreon}))
  })
