const { Command } = require('aghanim')

module.exports = new Command('invite',{
  category : 'General', help : 'Invita a Roshan a tu servidor', args : ''},
  function(msg, args, command){
    return msg.reply(this.locale.replacer(this.locale.getUserString('inviteServer',msg),{link : this.config.invite}))
  })
