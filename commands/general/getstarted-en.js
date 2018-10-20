const { Command } = require('aghanim')
const basic = require('../../helpers/basic')

module.exports = new Command('getstarted-en',{
  category : 'Server', help : 'Configuración de servidor', args : ''},
  function(msg, args, command){
    msg.replyDM('')
  })
