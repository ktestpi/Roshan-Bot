const { Command } = require('aghanim')
const basic = require('../../../helpers/basic')
const { Datee , Request} = require('erisjs-utils')

module.exports = new Command('diresetstatus',{
  category : 'Diretide', help : '', args : '', ownerOnly : true},
  function(msg, args, command){
    const game = command.game
    if(!args[1]){return command.error()}
    return game.status.statusTo(args[1])
  })
