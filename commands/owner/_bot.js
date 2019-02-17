const { Command } = require('aghanim')

module.exports = new Command('bot',{
  category : 'Owner', help : 'Comando de control del bot', args : '<cmd>',
  ownerOnly : true},
  async function(msg, args, client){
  })
