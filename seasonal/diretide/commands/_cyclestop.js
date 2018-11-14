const { Command } = require('aghanim')
const { Datee , Request} = require('erisjs-utils')

module.exports = new Command('cyclestop',{
  category : 'Diretide', help : '', args : '', ownerOnly : true},
  function(msg, args, command){
    const game = command.game
    return game.status.stopcycle()

  })
