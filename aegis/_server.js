const { Command } = require('aghanim')

module.exports = new Command('server',{
  category : 'Aegis', help : 'Elimina los últimos <mensajes>', args : '<mensajes>',
  rolesCanUse : 'aegis'},
  function(msg, args, command){

  })
