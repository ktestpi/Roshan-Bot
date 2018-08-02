const { Command } = require('aghanim')
const lang = require('../lang.json')

module.exports = new Command('invite',{
  category : 'General', help : 'Invita a Roshan a tu servidor', args : ''},
  function(msg, args, command){
    msg.reply(this.replace.do(lang.inviteServer,{link : this.config.invite},true))
  })
