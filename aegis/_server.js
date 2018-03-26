const { Command } = require('drow')

module.exports = new Command('server',{
  category : 'Aegis', help : 'Elimina los últimos <mensajes>', args : '<mensajes>',
  rolesCanUse : 'aegis'},
  function(msg, args, command){

  })
