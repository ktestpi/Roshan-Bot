const { Command } = require('aghanim')
const util = require('erisjs-utils')

module.exports = new Command('switches',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Control de los Switches', args : '<cmd>',
  ownerOnly : true},
  async function(msg, args, client){
    
  })
