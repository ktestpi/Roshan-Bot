const { Command } = require('aghanim')
const basic = require('../../helpers/basic')

module.exports = new Command('reset',{subcommandFrom : 'server',
  category : 'Server', help : 'Reinicia configuración del servidor', args : '',
  rolesCanUse: 'aegis'},
  function(msg, args, command){
    return basic.resetServerConfig(this,msg.channel.guild).then(() => msg.reply(this.locale.getChannelString('serverConfigReseted',msg)))
  })
