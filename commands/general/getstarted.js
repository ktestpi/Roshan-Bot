const { Command } = require('aghanim')

module.exports = new Command('getstarted',{
  category : 'Server', help : 'Configuración de servidor', args : ''},
  async function (msg, args, client, command){
    return msg.reply('getstarted.text')
  })
