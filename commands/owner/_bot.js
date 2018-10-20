const { Command } = require('aghanim')

module.exports = new Command('bot',{
  category : 'Owner', help : 'Comando de control del bot', args : '<cmd>',
  ownerOnly : true},
  function(msg, args, command){
    // let self = this
  })
