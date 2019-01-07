const { Command } = require('aghanim')

module.exports = new Command('reset',{subcommandFrom : 'server',
  category : 'Server', help : 'Reinicia configuración del servidor', args : '',
  rolesCanUse: 'aegis'},
  function(msg, args, command){
    return this.components.Guild.createProcess(msg.channel.guild).then(() => msg.reply(this.locale.getChannelString('serverConfigReseted',msg)))
  })
