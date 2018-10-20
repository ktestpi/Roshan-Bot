const { Command } = require('aghanim')

module.exports = new Command(['discord','foso','devserver'],{
  category : 'General', help : 'Invitación al Discord de desarrollo de Roshan', args : ''},
  function(msg, args, command){
    return msg.reply(this.locale.replacer(this.locale.getUserString('inviteDevServer',msg),{link : this.config.server}))
  })
