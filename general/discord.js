const { Command } = require('aghanim')
const lang = require('../lang.json')

module.exports = new Command(['discord','foso','devserver'],{
  category : 'General', help : 'Invitación al Discord de desarrollo de Roshan', args : ''},
  function(msg, args, command){
    msg.reply(this.replace.do(lang.inviteDevServer,{link : this.config.server},true))
  })
