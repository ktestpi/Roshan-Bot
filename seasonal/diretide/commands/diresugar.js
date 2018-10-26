const { Command } = require('aghanim')
const basic = require('../../../helpers/basic')
const { Datee , Request} = require('erisjs-utils')

module.exports = new Command('diresugar',{
  category : 'Diretide', help : '', args : '',
  ownerOnly : true, cooldown : 15*60,
  cooldownMessage : function(msg,args,command,cooldown){return `${command.game.actions.secondsToHms(cooldown)} remaining`}},
  function(msg, args, command){
    const game = command.game
    const user = game.actions.getCacheUserFromMsg(msg)

    if(game.status.getStatus().mode === 2){msg.addReactionFail();return command.error()}
    return game.status.statusToSugarRush().then(() => msg.addReactionSuccess())
  })
