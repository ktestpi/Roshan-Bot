const { Command } = require('aghanim')

module.exports = new Command('reset',{subcommandFrom : 'server',
  category : 'Server', help : 'Reinicia configuración del servidor', args : '',
  rolesCanUse: 'aegis'},
  async function (msg, args, client, command){
    return client.components.Guild.createProcess(msg.channel.guild)
      .then(() => msg.reply('server.reset.message'))
  })
