const { Command } = require('aghanim')

module.exports = new Command('getstarted',{
  category : 'Server', help : 'Configuración de servidor', args : ''},
  function(msg, args, command){
    return msg.reply(this.locale.getUserString('getStarted',msg))
  })
